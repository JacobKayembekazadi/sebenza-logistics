
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
import type { PurchaseOrder } from "@/lib/data";
import { useEffect, useState } from "react";
import { Textarea } from "../ui/textarea";

interface PurchaseOrderFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  purchaseOrder?: PurchaseOrder;
}

export function PurchaseOrderFormDialog({ open, onOpenChange, purchaseOrder }: PurchaseOrderFormDialogProps) {
  const { suppliers, addPurchaseOrder, updatePurchaseOrder } = useData();
  const [supplierId, setSupplierId] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState<PurchaseOrder['status']>('Draft');
  const [date, setDate] = useState('');
  
  const isEditMode = !!purchaseOrder;

  useEffect(() => {
    if (purchaseOrder) {
      setSupplierId(purchaseOrder.supplierId);
      setAmount(purchaseOrder.amount.toString());
      setStatus(purchaseOrder.status);
      setDate(purchaseOrder.date);
    } else {
      setSupplierId(suppliers[0]?.id || '');
      setAmount('');
      setStatus('Draft');
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [purchaseOrder, open, suppliers]);

  const handleSubmit = () => {
    const selectedSupplier = suppliers.find(s => s.id === supplierId);
    if (!selectedSupplier) return;

    const poData = { 
      supplierId, 
      supplierName: selectedSupplier.name,
      amount: parseFloat(amount),
      status, 
      date 
    };

    if (isEditMode && purchaseOrder) {
      updatePurchaseOrder({ ...purchaseOrder, ...poData });
    } else {
      addPurchaseOrder(poData);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Purchase Order' : 'Add New PO'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Update the details of the PO below.' : 'Fill in the details below to add a new PO.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="supplier" className="text-right">Supplier</Label>
            <Select onValueChange={setSupplierId} value={supplierId}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select supplier" />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
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
            <Select onValueChange={(value: PurchaseOrder['status']) => setStatus(value)} value={status}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Sent">Sent</SelectItem>
                <SelectItem value="Fulfilled">Fulfilled</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit}>{isEditMode ? 'Save Changes' : 'Add PO'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
