
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
import type { JobPosting } from "@/lib/data";
import { useEffect, useState } from "react";

interface JobFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job?: JobPosting;
}

export function JobFormDialog({ open, onOpenChange, job }: JobFormDialogProps) {
  const { addJobPosting, updateJobPosting } = useData();
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState<JobPosting['status']>('Open');
  
  const isEditMode = !!job;

  useEffect(() => {
    if (job) {
      setTitle(job.title);
      setDepartment(job.department);
      setLocation(job.location);
      setStatus(job.status);
    } else {
      setTitle('');
      setDepartment('');
      setLocation('');
      setStatus('Open');
    }
  }, [job, open]);

  const handleSubmit = () => {
    const jobData = { title, department, location, status };
    
    if (isEditMode && job) {
      updateJobPosting({ ...job, ...jobData });
    } else {
      addJobPosting(jobData);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Job Posting' : 'Add New Job Posting'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Update the details of the job posting below.' : 'Fill in the details below to add a new job posting.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="department" className="text-right">Department</Label>
            <Input id="department" value={department} onChange={(e) => setDepartment(e.target.value)} className="col-span-3" />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">Location</Label>
            <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">Status</Label>
            <Select onValueChange={(value: JobPosting['status']) => setStatus(value)} value={status}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
                <SelectItem value="Archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit}>{isEditMode ? 'Save Changes' : 'Add Posting'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
