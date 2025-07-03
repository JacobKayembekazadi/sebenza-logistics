
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
import { useData } from "@/contexts/data-context";
import type { StockItem } from "@/lib/data";
import { useEffect, useState } from "react";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface InventoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: StockItem;
}

export function InventoryFormDialog({ open, onOpenChange, item }: InventoryFormDialogProps) {
  const { addStockItem, updateStockItem, warehouses } = useData();
  
  const [reference, setReference] = useState('');
  const [senderName, setSenderName] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [weight, setWeight] = useState('');
  const [value, setValue] = useState('');
  const [status, setStatus] = useState<StockItem['status']>('In Warehouse');
  const [entryDate, setEntryDate] = useState('');
  const [warehouseId, setWarehouseId] = useState<string | undefined>('');
  const [color, setColor] = useState('');
  
  const isEditMode = !!item;

  useEffect(() => {
    if (item) {
      setReference(item.reference);
      setSenderName(item.senderName);
      setReceiverName(item.receiverName);
      setDescription(item.description);
      setQuantity(item.quantity.toString());
      setWeight(item.weight.toString());
      setValue(item.value.toString());
      setStatus(item.status);
      setEntryDate(item.entryDate);
      setWarehouseId(item.warehouseId || '');
      setColor(item.color || '');
    } else {
      setReference('');
      setSenderName('');
      setReceiverName('');
      setDescription('');
      setQuantity('1');
      setWeight('');
      setValue('');
      setStatus('In Warehouse');
      setEntryDate(new Date().toISOString().split('T')[0]);
      setWarehouseId(warehouses[0]?.id || '');
      setColor('');
    }
  }, [item, open, warehouses]);

  const handleSubmit = () => {
    const selectedWarehouse = warehouses.find(w => w.id === warehouseId);
    
    const itemData: Omit<StockItem, 'id'> = { 
      reference,
      senderName,
      receiverName,
      description,
      quantity: parseInt(quantity, 10),
      weight: parseFloat(weight),
      value: parseFloat(value),
      status,
      entryDate,
      warehouseId,
      warehouseName: selectedWarehouse?.name,
      color: color || undefined,
    };

    if (isEditMode && item) {
      updateStockItem({ ...item, ...itemData });
    } else {
      addStockItem(itemData);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Stock Item' : 'Add New Stock Item'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Update the stock item details below.' : 'Fill in the details below to add a new stock item.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="reference" className="text-right">Reference</Label>
            <Input id="reference" value={reference} onChange={(e) => setReference(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right pt-2">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="color" className="text-right">Color</Label>
            <Input id="color" value={color} onChange={(e) => setColor(e.target.value)} className="col-span-3" />
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
            <Label htmlFor="warehouse" className="text-right">Warehouse</Label>
            <Select onValueChange={(value) => setWarehouseId(value)} value={warehouseId || ''}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a warehouse" />
              </SelectTrigger>
              <SelectContent>
                {warehouses.map(w => <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantity" className="text-right">Quantity</Label>
            <Input id="quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="weight" className="text-right">Weight (kg)</Label>
            <Input id="weight" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="value" className="text-right">Value ($)</Label>
            <Input id="value" type="number" value={value} onChange={(e) => setValue(e.target.value)} className="col-span-3" />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">Status</Label>
            <Select onValueChange={(value: StockItem['status']) => setStatus(value)} value={status}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="In Warehouse">In Warehouse</SelectItem>
                <SelectItem value="In Transit">In Transit</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="entryDate" className="text-right">Entry Date</Label>
            <Input id="entryDate" type="date" value={entryDate} onChange={(e) => setEntryDate(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="document" className="text-right">Document</Label>
            <Input id="document" type="file" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit}>{isEditMode ? 'Save Changes' : 'Add Item'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
