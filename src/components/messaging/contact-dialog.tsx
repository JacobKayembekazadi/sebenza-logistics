'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { Contact } from '@/lib/data';

interface ContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact?: Contact | null;
  onSave: (contact: Omit<Contact, 'id'> | Contact) => void;
}

export function ContactDialog({ open, onOpenChange, contact, onSave }: ContactDialogProps) {
  const [formData, setFormData] = useState({
    name: contact?.name || '',
    role: contact?.role || '',
    avatar: contact?.avatar || '/avatars/default.jpg',
    online: contact?.online || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (contact) {
      // Edit existing contact
      onSave({ ...contact, ...formData });
    } else {
      // Add new contact
      onSave(formData);
    }
    
    onOpenChange(false);
    setFormData({ name: '', role: '', avatar: '/avatars/default.jpg', online: false });
  };

  const handleClose = () => {
    onOpenChange(false);
    setFormData({ name: '', role: '', avatar: '/avatars/default.jpg', online: false });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{contact ? 'Edit Contact' : 'Add New Contact'}</DialogTitle>
            <DialogDescription>
              {contact ? 'Update the contact information below.' : 'Fill in the details to add a new contact.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="avatar" className="text-right">
                Avatar URL
              </Label>
              <Input
                id="avatar"
                value={formData.avatar}
                onChange={(e) => setFormData(prev => ({ ...prev, avatar: e.target.value }))}
                className="col-span-3"
                placeholder="/avatars/default.jpg"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="online" className="text-right">
                Online
              </Label>
              <div className="col-span-3">
                <Switch
                  id="online"
                  checked={formData.online}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, online: checked }))}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">
              {contact ? 'Update Contact' : 'Add Contact'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
