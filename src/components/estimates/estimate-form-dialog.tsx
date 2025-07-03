
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
import type { Estimate } from "@/lib/data";
import { useEffect, useState } from "react";

interface EstimateFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  estimate?: Estimate;
}

export function EstimateFormDialog({ open, onOpenChange, estimate }: EstimateFormDialogProps) {
  const { clients, addEstimate, updateEstimate } = useData();
  const [client, setClient] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState<Estimate['status']>('Draft');
  const [date, setDate] = useState('');
  
  const isEditMode = !!estimate;

  useEffect(() => {
    if (estimate) {
      setClient(estimate.client);
      setAmount(estimate.amount.toString());
      setStatus(estimate.status);
      setDate(estimate.date);
    } else {
      setClient(clients[0]?.name || '');
      setAmount('');
      setStatus('Draft');
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [estimate, open, clients]);

  const handleSubmit = () => {
    const estimateData = { 
      client, 
      amount: parseFloat(amount),
      status, 
      date 
    };

    if (isEditMode && estimate) {
      updateEstimate({ ...estimate, ...estimateData });
    } else {
      addEstimate(estimateData);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Estimate' : 'Add New Estimate'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Update the details of the estimate below.' : 'Fill in the details below to add a new estimate.'}
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
            <Label htmlFor="amount" className="text-right">Amount</Label>
            <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">Date</Label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">Status</Label>
            <Select onValueChange={(value: Estimate['status']) => setStatus(value)} value={status}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Sent">Sent</SelectItem>
                <SelectItem value="Accepted">Accepted</SelectItem>
                <SelectItem value="Declined">Declined</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit}>{isEditMode ? 'Save Changes' : 'Add Estimate'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
