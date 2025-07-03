
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
import type { Invoice, Payment, PaymentMethod } from "@/lib/data";
import { paymentMethods } from "@/lib/data";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "../ui/textarea";

interface PaymentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice?: Invoice;
  payment?: Payment;
}

export function PaymentFormDialog({ open, onOpenChange, invoice, payment }: PaymentFormDialogProps) {
  const { addPayment, updatePayment } = useData();
  const { toast } = useToast();
  
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [method, setMethod] = useState<PaymentMethod>(paymentMethods[0]);
  const [notes, setNotes] = useState('');

  const isEditMode = !!payment;

  const totalAmount = invoice ? invoice.amount + (invoice.tax || 0) - (invoice.discount || 0) + (invoice.lateFee || 0) : 0;
  const balanceDue = invoice ? totalAmount - (invoice.paidAmount || 0) : 0;

  useEffect(() => {
    if (open) {
      if (isEditMode && payment) {
        setAmount(payment.amount.toString());
        setDate(payment.date);
        setMethod(payment.method);
        setNotes(payment.notes || '');
      } else if (invoice) {
        setAmount(balanceDue.toFixed(2));
        setDate(new Date().toISOString().split('T')[0]);
        setMethod(paymentMethods[0]);
        setNotes('');
      }
    }
  }, [invoice, payment, open, balanceDue, isEditMode]);

  const handleSubmit = () => {
    const paymentAmount = parseFloat(amount);
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      toast({ variant: 'destructive', title: 'Invalid Amount', description: 'Please enter a valid payment amount.' });
      return;
    }
    
    if (isEditMode && payment) {
      updatePayment({
        ...payment,
        amount: paymentAmount,
        date,
        method,
        notes,
      });
      toast({ title: 'Payment Updated', description: 'The payment record has been successfully updated.' });
    } else if (invoice) {
       if (paymentAmount > balanceDue + 0.001) { // Add tolerance for float issues
         toast({ variant: 'destructive', title: 'Overpayment Warning', description: 'Payment amount cannot be greater than the balance due.' });
         return;
      }
      addPayment({
        invoiceId: invoice.id,
        clientName: invoice.client,
        amount: paymentAmount,
        date,
        method,
        notes,
      });
      toast({ title: 'Payment Recorded', description: `A payment of $${paymentAmount.toFixed(2)} has been recorded for invoice ${invoice.id}.`});
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Payment' : 'Record Payment'}</DialogTitle>
          {invoice && !isEditMode && (
            <DialogDescription>
              For Invoice {invoice.id} &bull; Balance Due: ${balanceDue.toFixed(2)}
            </DialogDescription>
          )}
          {payment && isEditMode && (
             <DialogDescription>
              Editing payment for Invoice {payment.invoiceId}
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">Amount</Label>
            <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">Date</Label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="method" className="text-right">Method</Label>
            <Select onValueChange={(value: PaymentMethod) => setMethod(value)} value={method}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
           <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="notes" className="text-right pt-2">Notes</Label>
            <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} className="col-span-3" placeholder="Optional payment notes..." />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit}>{isEditMode ? 'Save Changes' : 'Record Payment'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
