
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
import { Textarea } from "../ui/textarea";
import { Separator } from "../ui/separator";

interface InvoiceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice?: Invoice;
}

export function InvoiceFormDialog({ open, onOpenChange, invoice }: InvoiceFormDialogProps) {
  const { clients, projects, addInvoice, updateInvoice } = useData();
  const [client, setClient] = useState('');
  const [amount, setAmount] = useState(''); // Represents subtotal
  const [tax, setTax] = useState('');
  const [discount, setDiscount] = useState('');
  const [notes, setNotes] = useState('');
  const [termsAndConditions, setTermsAndConditions] = useState('');
  const [signature, setSignature] = useState('');
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
      setTax(invoice.tax?.toString() || '');
      setDiscount(invoice.discount?.toString() || '');
      setNotes(invoice.notes || '');
      setTermsAndConditions(invoice.termsAndConditions || '');
      setSignature(invoice.signature || '');
      setStatus(invoice.status);
      setDate(invoice.date);
      setProjectId(invoice.projectId);
      setType(invoice.type);
    } else {
      setClient(clients[0]?.name || '');
      setAmount('');
      setTax('');
      setDiscount('');
      setNotes('');
      setTermsAndConditions('Payment due within 30 days.');
      setSignature('');
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
      amount: parseFloat(amount) || 0,
      tax: tax ? parseFloat(tax) : undefined,
      discount: discount ? parseFloat(discount) : undefined,
      notes: notes || undefined,
      termsAndConditions: termsAndConditions || undefined,
      signature: signature || undefined,
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
  
  const totalAmount = (parseFloat(amount) || 0) + (parseFloat(tax) || 0) - (parseFloat(discount) || 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Invoice' : 'New Invoice'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Update the details of the invoice below.' : 'Fill in the details to create a new invoice.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto px-2">
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
            <Label htmlFor="project" className="text-right">Project</Label>
            <Select onValueChange={(value) => setProjectId(value === 'none' ? undefined : value)} value={projectId || 'none'}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="(Optional) Assign to project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
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
          
          <Separator className="my-2" />

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">Subtotal</Label>
            <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="col-span-3" placeholder="0.00" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="discount" className="text-right">Discount</Label>
            <Input id="discount" type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} className="col-span-3" placeholder="0.00"/>
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tax" className="text-right">Tax</Label>
            <Input id="tax" type="number" value={tax} onChange={(e) => setTax(e.target.value)} className="col-span-3" placeholder="0.00"/>
          </div>
          
          <Separator className="my-2" />

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-bold">Total</Label>
            <div className="col-span-3 font-bold text-lg">${totalAmount.toFixed(2)}</div>
          </div>
          
          <Separator className="my-2" />
          
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="notes" className="text-right pt-2">Notes</Label>
            <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} className="col-span-3" placeholder="Internal notes or notes visible to client..."/>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="termsAndConditions" className="text-right pt-2">Terms & Conditions</Label>
            <Textarea id="termsAndConditions" value={termsAndConditions} onChange={(e) => setTermsAndConditions(e.target.value)} className="col-span-3" placeholder="e.g., Payment due upon receipt"/>
          </div>

          <Separator className="my-2" />

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">Issue Date</Label>
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
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="signature" className="text-right">Signed By</Label>
            <Input id="signature" value={signature} onChange={(e) => setSignature(e.target.value)} className="col-span-3" placeholder="Type name for e-signature"/>
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
          <Button type="submit" onClick={handleSubmit}>{isEditMode ? 'Save Changes' : 'Create Invoice'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
