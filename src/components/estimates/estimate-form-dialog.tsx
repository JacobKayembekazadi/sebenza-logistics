
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
import { Textarea } from "../ui/textarea";
import { Separator } from "../ui/separator";

interface EstimateFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  estimate?: Estimate;
}

export function EstimateFormDialog({ open, onOpenChange, estimate }: EstimateFormDialogProps) {
  const { clients, addEstimate, updateEstimate } = useData();
  const [client, setClient] = useState('');
  const [amount, setAmount] = useState('');
  const [tax, setTax] = useState('');
  const [discount, setDiscount] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [termsAndConditions, setTermsAndConditions] = useState('');
  const [signature, setSignature] = useState('');
  const [status, setStatus] = useState<Estimate['status']>('Draft');
  const [date, setDate] = useState('');
  
  const isEditMode = !!estimate;

  useEffect(() => {
    if (estimate) {
      setClient(estimate.client);
      setAmount(estimate.amount.toString());
      setTax(estimate.tax?.toString() || '');
      setDiscount(estimate.discount?.toString() || '');
      setShippingAddress(estimate.shippingAddress || '');
      setNotes(estimate.notes || '');
      setTermsAndConditions(estimate.termsAndConditions || '');
      setSignature(estimate.signature || '');
      setStatus(estimate.status);
      setDate(estimate.date);
    } else {
      setClient(clients[0]?.name || '');
      setAmount('');
      setTax('');
      setDiscount('');
      setShippingAddress('');
      setNotes('');
      setTermsAndConditions('Payment due within 30 days.');
      setSignature('');
      setStatus('Draft');
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [estimate, open, clients]);

  const handleSubmit = () => {
    const estimateData = { 
      client, 
      amount: parseFloat(amount) || 0,
      tax: tax ? parseFloat(tax) : undefined,
      discount: discount ? parseFloat(discount) : undefined,
      shippingAddress: shippingAddress || undefined,
      notes: notes || undefined,
      termsAndConditions: termsAndConditions || undefined,
      signature: signature || undefined,
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

  const totalAmount = (parseFloat(amount) || 0) + (parseFloat(tax) || 0) - (parseFloat(discount) || 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Estimate' : 'New Estimate'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Update the estimate details below.' : 'Fill in the details to create a new estimate.'}
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
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="shippingAddress" className="text-right pt-2">Shipping Address</Label>
            <Textarea id="shippingAddress" value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} className="col-span-3" placeholder="Client's shipping address"/>
          </div>

          <Separator className="my-2" />

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">Subtotal</Label>
            <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="col-span-3" placeholder="0.00"/>
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
            <Textarea id="termsAndConditions" value={termsAndConditions} onChange={(e) => setTermsAndConditions(e.target.value)} className="col-span-3" placeholder="e.g., Payment due within 30 days."/>
          </div>

          <Separator className="my-2" />
          
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
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="signature" className="text-right">Signed By</Label>
            <Input id="signature" value={signature} onChange={(e) => setSignature(e.target.value)} className="col-span-3" placeholder="Type name to sign"/>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit}>{isEditMode ? 'Save Changes' : 'Create Estimate'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
