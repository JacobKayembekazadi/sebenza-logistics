
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
import type { MoneyTransfer } from "@/lib/data";
import { useEffect, useState } from "react";

interface MoneyTransferFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transfer?: MoneyTransfer;
}

export function MoneyTransferFormDialog({ open, onOpenChange, transfer }: MoneyTransferFormDialogProps) {
  const { addMoneyTransfer, updateMoneyTransfer } = useData();
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [senderName, setSenderName] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [amountSent, setAmountSent] = useState('');
  const [exchangeRate, setExchangeRate] = useState('');
  const [referenceCode, setReferenceCode] = useState('');
  const [status, setStatus] = useState<MoneyTransfer['status']>('Pending Collection');
  const [date, setDate] = useState('');
  const [amountToCollect, setAmountToCollect] = useState(0);

  const isEditMode = !!transfer;

  useEffect(() => {
    if (transfer) {
      setFromLocation(transfer.fromLocation);
      setToLocation(transfer.toLocation);
      setSenderName(transfer.senderName);
      setReceiverName(transfer.receiverName);
      setAmountSent(transfer.amountSent.toString());
      setExchangeRate(transfer.exchangeRate.toString());
      setReferenceCode(transfer.referenceCode);
      setStatus(transfer.status);
      setDate(transfer.date);
    } else {
      setFromLocation('');
      setToLocation('');
      setSenderName('');
      setReceiverName('');
      setAmountSent('');
      setExchangeRate('');
      setReferenceCode('');
      setStatus('Pending Collection');
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [transfer, open]);

  useEffect(() => {
    const sent = parseFloat(amountSent);
    const rate = parseFloat(exchangeRate);
    if (!isNaN(sent) && !isNaN(rate)) {
      setAmountToCollect(sent * rate);
    } else {
      setAmountToCollect(0);
    }
  }, [amountSent, exchangeRate]);

  const handleSubmit = () => {
    const transferData = { 
      fromLocation,
      toLocation,
      senderName,
      receiverName,
      amountSent: parseFloat(amountSent),
      exchangeRate: parseFloat(exchangeRate),
      referenceCode,
      status,
      date 
    };

    if (isEditMode && transfer) {
      updateMoneyTransfer({ ...transfer, ...transferData });
    } else {
      addMoneyTransfer(transferData);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Money Transfer' : 'Log New Money Transfer'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Update the details of the transfer below.' : 'Fill in the details for the new money transfer.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto px-2">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fromLocation" className="text-right">From</Label>
            <Input id="fromLocation" value={fromLocation} onChange={(e) => setFromLocation(e.target.value)} className="col-span-3" />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="toLocation" className="text-right">To</Label>
            <Input id="toLocation" value={toLocation} onChange={(e) => setToLocation(e.target.value)} className="col-span-3" />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="senderName" className="text-right">Sender</Label>
            <Input id="senderName" value={senderName} onChange={(e) => setSenderName(e.target.value)} className="col-span-3" />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="receiverName" className="text-right">Receiver</Label>
            <Input id="receiverName" value={receiverName} onChange={(e) => setReceiverName(e.target.value)} className="col-span-3" />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amountSent" className="text-right">Amount Sent</Label>
            <Input id="amountSent" type="number" value={amountSent} onChange={(e) => setAmountSent(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="exchangeRate" className="text-right">Rate</Label>
            <Input id="exchangeRate" type="number" value={exchangeRate} onChange={(e) => setExchangeRate(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amountToCollect" className="text-right">To Collect</Label>
            <Input id="amountToCollect" value={amountToCollect.toFixed(2)} readOnly className="col-span-3 bg-muted" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="referenceCode" className="text-right">Ref Code</Label>
            <Input id="referenceCode" value={referenceCode} onChange={(e) => setReferenceCode(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">Date</Label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">Status</Label>
            <Select onValueChange={(value: MoneyTransfer['status']) => setStatus(value)} value={status}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending Collection">Pending Collection</SelectItem>
                <SelectItem value="Collected">Collected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit}>{isEditMode ? 'Save Changes' : 'Log Transfer'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
