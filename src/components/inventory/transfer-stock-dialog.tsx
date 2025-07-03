
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
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useData } from "@/contexts/data-context";
import type { StockItem } from "@/lib/data";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface TransferStockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: StockItem;
}

export function TransferStockDialog({ open, onOpenChange, item }: TransferStockDialogProps) {
  const { warehouses, transferStockItem } = useData();
  const { toast } = useToast();
  const [toWarehouseId, setToWarehouseId] = useState<string>('');

  useEffect(() => {
    if (open) {
      // Reset selection when dialog opens
      setToWarehouseId('');
    }
  }, [open]);

  if (!item) return null;

  const handleSubmit = () => {
    if (!toWarehouseId) {
      toast({
        variant: 'destructive',
        title: 'Selection Required',
        description: 'Please select a destination warehouse.',
      });
      return;
    }

    transferStockItem(item.id, toWarehouseId);
    
    toast({
      title: 'Stock Transferred',
      description: `Successfully transferred "${item.description}" to the new warehouse.`,
    });
    
    onOpenChange(false);
  };

  const availableWarehouses = warehouses.filter(w => w.id !== item.warehouseId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Transfer Stock Item</DialogTitle>
          <DialogDescription>
            Transfer "{item.description}" to a new warehouse.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-1">
            <Label>From Warehouse</Label>
            <p className="text-sm font-medium p-2 bg-muted rounded-md">{item.warehouseName || 'N/A'}</p>
          </div>
          <div className="space-y-1">
            <Label htmlFor="to-warehouse">To Warehouse</Label>
            <Select onValueChange={setToWarehouseId} value={toWarehouseId}>
              <SelectTrigger id="to-warehouse">
                <SelectValue placeholder="Select destination warehouse" />
              </SelectTrigger>
              <SelectContent>
                {availableWarehouses.length > 0 ? (
                  availableWarehouses.map(w => <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)
                ) : (
                  <SelectItem value="none" disabled>No other warehouses available</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit} disabled={!toWarehouseId || availableWarehouses.length === 0}>Confirm Transfer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
