
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
import { Textarea } from "@/components/ui/textarea";
import { useData } from "@/contexts/data-context";
import type { Meeting } from "@/lib/data";
import { useEffect, useState } from "react";

interface EventFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meeting?: Meeting;
}

export function EventFormDialog({ open, onOpenChange, meeting }: EventFormDialogProps) {
  const { addMeeting, updateMeeting } = useData();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  
  const isEditMode = !!meeting;

  useEffect(() => {
    if (meeting) {
      setTitle(meeting.title);
      setDescription(meeting.description);
      setDate(meeting.date);
    } else {
      setTitle('');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [meeting, open]);

  const handleSubmit = () => {
    const meetingData = { 
      title,
      description,
      date,
    };

    if (isEditMode && meeting) {
      updateMeeting({ ...meeting, ...meetingData });
    } else {
      addMeeting(meetingData);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Event' : 'Create New Event'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Update the event details below.' : 'Fill in the details for the new calendar event.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">Date</Label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right pt-2">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit}>{isEditMode ? 'Save Changes' : 'Create Event'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
