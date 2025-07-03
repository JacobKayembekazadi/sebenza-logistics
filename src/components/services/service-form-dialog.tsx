
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
import type { Service } from "@/lib/data";
import { useEffect, useState } from "react";
import { Textarea } from "../ui/textarea";

interface ServiceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service?: Service;
}

export function ServiceFormDialog({ open, onOpenChange, service }: ServiceFormDialogProps) {
  const { addService, updateService } = useData();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  
  const isEditMode = !!service;

  useEffect(() => {
    if (service) {
      setName(service.name);
      setDescription(service.description);
      setPrice(service.price.toString());
    } else {
      setName('');
      setDescription('');
      setPrice('');
    }
  }, [service, open]);

  const handleSubmit = () => {
    const serviceData = { 
      name, 
      description,
      price: parseFloat(price)
    };
    
    if (isEditMode && service) {
      updateService({ ...service, ...serviceData });
    } else {
      addService(serviceData);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Service' : 'Add New Service'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Update the service details below.' : 'Fill in the details below to add a new service or product.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right pt-2">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">Price</Label>
            <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit}>{isEditMode ? 'Save Changes' : 'Add Service'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
