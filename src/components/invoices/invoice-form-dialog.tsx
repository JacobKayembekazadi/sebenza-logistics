
'use client';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useData } from "@/contexts/data-context";
import type { Invoice } from "@/lib/data";
import { useEffect, useState } from "react";

interface InvoiceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice?: Invoice;
}

export function InvoiceFormDialog({ open, onOpenChange, invoice }: InvoiceFormDialogProps) {
  const { clients, projects, addInvoice, updateInvoice } = useData();
  const [client, setClient] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState<Invoice['status']>('Pending');
  const [date, setDate] = useState('');
  const [projectId, setProjectId] = useState<string | undefined>();
  const [type, setType] = useState<Invoice['type']>('Standard');
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);
  
  const isEditMode = !!invoice;

  useEffect(() => {
    if (invoice) {
      setClient(invoice.client);
      setAmount(invoice.amount.toString());
      setStatus(invoice.status);
      setDate(invoice.date);
      setProjectId(invoice.projectId);
      setType(invoice.type);
    } else {
      setClient(clients[0]?.name || '');
      setAmount('');
      setStatus('Pending');
      setDate(new Date().toISOString().split('T')[0]);
      setProjectId(undefined);
      setType('Standard');
    }
    setInvoiceFile(null);
  }, [invoice, open, clients]);

  const handleSubmit = () => {
    const invoiceData = { 
      client, 
      amount: parseFloat(amount),
      status, 
      date,
      projectId,
      type,
    };

    if (isEditMode && invoice) {
      updateInvoice({ ...invoice, ...invoiceData });
    } else {
      let documentData;
      if (invoiceFile) {
        const getFileType = (mimeType: string) => {
          if (mimeType.includes('pdf')) return 'PDF';
          if (mimeType.includes('word')) return 'Word';
          if (mimeType.includes('image')) return 'Image';
          if (mimeType.includes('zip') || mimeType.includes('archive')) return 'Archive';
          return 'File';
        }
        documentData = {
          name: invoiceFile.name,
          type: getFileType(invoiceFile.type),
          size: `${(invoiceFile.size / 1024 / 1024).toFixed(2)} MB`,
        };
      }
      addInvoice(invoiceData, documentData);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Invoice' : 'Add New Invoice'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Update the details of the invoice below.' : 'Fill in the details below to add a new invoice.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="client" className="text-right">Client</Label>
            <Select onValueChange={setClient} value={client}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">Type</Label>
            <Select onValueChange={(value: Invoice['type']) => setType(value)} value={type}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Standard">Standard</SelectItem>
                <SelectItem value="Retainer">Retainer</SelectItem>
                <SelectItem value="Pro-forma">Pro-forma</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">Amount</Label>
            <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="project" className="text-right">Project</Label>
            <Select onValueChange={(value) => setProjectId(value === 'none' ? undefined : value)} value={projectId || 'none'}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Assign to project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">Date</Label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">Status</Label>
            <Select onValueChange={(value: Invoice['status']) => setStatus(value)} value={status}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Partial">Partial</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {!isEditMode && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="invoice-file" className="text-right">
                Attachment
              </Label>
              <Input
                id="invoice-file"
                type="file"
                className="col-span-3"
                onChange={(e) => setInvoiceFile(e.target.files?.[0] || null)}
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit}>{isEditMode ? 'Save Changes' : 'Add Invoice'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
