
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
import type { Warehouse } from "@/lib/data";
import { useEffect, useState } from "react";

interface WarehouseFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  warehouse?: Warehouse;
}

export function WarehouseFormDialog({ open, onOpenChange, warehouse }: WarehouseFormDialogProps) {
  const { addWarehouse, updateWarehouse } = useData();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  
  const isEditMode = !!warehouse;

  useEffect(() => {
    if (warehouse) {
      setName(warehouse.name);
      setLocation(warehouse.location);
    } else {
      setName('');
      setLocation('');
    }
  }, [warehouse, open]);

  const handleSubmit = () => {
    const warehouseData = { name, location };
    
    if (isEditMode && warehouse) {
      updateWarehouse({ ...warehouse, ...warehouseData });
    } else {
      addWarehouse(warehouseData);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Warehouse' : 'Add New Warehouse'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Update the details of the warehouse below.' : 'Fill in the details for the new warehouse location.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">Location</Label>
            <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit}>{isEditMode ? 'Save Changes' : 'Add Warehouse'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
