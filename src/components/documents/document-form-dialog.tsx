
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
import type { Document } from "@/lib/data";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface DocumentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document?: Document;
}

export function DocumentFormDialog({ open, onOpenChange, document }: DocumentFormDialogProps) {
  const { addDocument, updateDocument, invoices, projects } = useData();
  const [name, setName] = useState('');
  const [type, setType] = useState('PDF');
  const [relatedTo, setRelatedTo] = useState('');
  
  const isEditMode = !!document;

  useEffect(() => {
    if (document) {
      setName(document.name);
      setType(document.type);
      setRelatedTo(document.relatedTo);
    } else {
      setName('');
      setType('PDF');
      setRelatedTo('');
    }
  }, [document, open]);

  const handleSubmit = () => {
    const docData = { 
      name, 
      type, 
      relatedTo,
      size: `${(Math.random() * 10).toFixed(1)} MB`,
      uploadDate: new Date().toISOString().split('T')[0],
    };
    
    if (isEditMode && document) {
      updateDocument({ ...document, ...docData });
    } else {
      addDocument(docData);
    }
    onOpenChange(false);
  };

  const relatedOptions = [
    ...invoices.map(i => ({ value: i.id, label: `Invoice: ${i.id} (${i.client})` })),
    ...projects.map(p => ({ value: p.id, label: `Project: ${p.name}` }))
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Document' : 'Add New Document'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Update the document details below.' : 'Fill in the details below to add a new document.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" placeholder="e.g., contract.pdf" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">Type</Label>
            <Select onValueChange={(value: string) => setType(value)} value={type}>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="PDF">PDF</SelectItem>
                    <SelectItem value="Word">Word</SelectItem>
                    <SelectItem value="Image">Image</SelectItem>
                    <SelectItem value="Archive">Archive</SelectItem>
                </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="relatedTo" className="text-right">Related To</Label>
             <Select onValueChange={(value) => setRelatedTo(value === 'none' ? '' : value)} value={relatedTo || 'none'}>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="(Optional) Relate to invoice/project" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="none">(None)</SelectItem>
                    {relatedOptions.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
          {!isEditMode && (
             <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="file" className="text-right">File</Label>
                <Input id="file" type="file" className="col-span-3" />
             </div>
          )}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit}>{isEditMode ? 'Save Changes' : 'Add Document'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
