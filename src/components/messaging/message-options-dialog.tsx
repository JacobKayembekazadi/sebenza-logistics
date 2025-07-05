'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import type { Message } from '@/lib/data';
import { Edit, Trash2 } from 'lucide-react';

interface MessageOptionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: Message | null;
  onEdit: (messageId: string, newText: string) => void;
  onDelete: (messageId: string) => void;
}

export function MessageOptionsDialog({ open, onOpenChange, message, onEdit, onDelete }: MessageOptionsDialogProps) {
  const [editMode, setEditMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [editText, setEditText] = useState(message?.text || '');

  const handleEdit = () => {
    setEditText(message?.text || '');
    setEditMode(true);
  };

  const handleSaveEdit = () => {
    if (message && editText.trim()) {
      onEdit(message.id, editText.trim());
      setEditMode(false);
      onOpenChange(false);
    }
  };

  const handleDelete = () => {
    setDeleteMode(true);
  };

  const confirmDelete = () => {
    if (message) {
      onDelete(message.id);
      setDeleteMode(false);
      onOpenChange(false);
    }
  };

  const handleClose = () => {
    setEditMode(false);
    setDeleteMode(false);
    onOpenChange(false);
  };

  if (!message) return null;

  return (
    <>
      <Dialog open={open && !deleteMode} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editMode ? 'Edit Message' : 'Message Options'}</DialogTitle>
            <DialogDescription>
              {editMode ? 'Update your message below.' : 'Choose an action for this message.'}
            </DialogDescription>
          </DialogHeader>
          
          {editMode ? (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="message-text" className="text-right mt-2">
                  Message
                </Label>
                <Textarea
                  id="message-text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="col-span-3"
                  rows={3}
                  required
                />
              </div>
            </div>
          ) : (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleEdit}
                  disabled={message.from !== 'me'}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Message
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-destructive hover:text-destructive"
                  onClick={handleDelete}
                  disabled={message.from !== 'me'}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Message
                </Button>
              </div>
              {message.from !== 'me' && (
                <p className="text-sm text-muted-foreground">
                  You can only edit or delete your own messages.
                </p>
              )}
            </div>
          )}
          
          <DialogFooter>
            {editMode ? (
              <>
                <Button variant="outline" onClick={() => setEditMode(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit} disabled={!editText.trim()}>
                  Save Changes
                </Button>
              </>
            ) : (
              <Button onClick={handleClose}>
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteMode} onOpenChange={setDeleteMode}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Message</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this message? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
