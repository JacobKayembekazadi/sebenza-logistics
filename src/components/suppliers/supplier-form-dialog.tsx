
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
import type { Supplier } from "@/lib/data";
import { useEffect, useState } from "react";

interface SupplierFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplier?: Supplier;
}

export function SupplierFormDialog({ open, onOpenChange, supplier }: SupplierFormDialogProps) {
  const { addSupplier, updateSupplier } = useData();
  const [name, setName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  const isEditMode = !!supplier;

  useEffect(() => {
    if (supplier) {
      setName(supplier.name);
      setContactPerson(supplier.contactPerson);
      setEmail(supplier.email);
      setPhone(supplier.phone);
    } else {
      setName('');
      setContactPerson('');
      setEmail('');
      setPhone('');
    }
  }, [supplier, open]);

  const handleSubmit = () => {
    const supplierData = { name, contactPerson, email, phone };
    
    if (isEditMode && supplier) {
      updateSupplier({ ...supplier, ...supplierData });
    } else {
      addSupplier(supplierData);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Supplier' : 'Add New Supplier'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Update the details of the supplier below.' : 'Fill in the details below to add a new supplier.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="contactPerson" className="text-right">Contact</Label>
            <Input id="contactPerson" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">Phone</Label>
            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit}>{isEditMode ? 'Save Changes' : 'Add Supplier'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
