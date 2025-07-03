
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
import type { Project } from "@/lib/data";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Slider } from "../ui/slider";

interface ProjectFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Project;
}

export function ProjectFormDialog({ open, onOpenChange, project }: ProjectFormDialogProps) {
  const { addProject, updateProject } = useData();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<Project['status']>('Active');
  const [progress, setProgress] = useState(0);
  const [endDate, setEndDate] = useState('');

  const isEditMode = !!project;

  useEffect(() => {
    if (project) {
      setName(project.name);
      setLocation(project.location);
      setDescription(project.description);
      setStatus(project.status);
      setProgress(project.progress);
      setEndDate(project.endDate);
    } else {
      setName('');
      setLocation('');
      setDescription('');
      setStatus('Active');
      setProgress(0);
      setEndDate(new Date().toISOString().split('T')[0]);
    }
  }, [project, open]);

  const handleSubmit = () => {
    const projectData = { name, location, description, endDate };
    if (isEditMode && project) {
      updateProject({ ...project, ...projectData, status, progress });
    } else {
      addProject(projectData);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Project' : 'Add New Project'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Update the project details below.' : 'Fill in the details for the new project.'}
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
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right pt-2">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="endDate" className="text-right">End Date</Label>
            <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="col-span-3" />
          </div>
          {isEditMode && (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">Status</Label>
                <Select onValueChange={(value: Project['status']) => setStatus(value)} value={status}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="On Hold">On Hold</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="progress" className="text-right">Progress</Label>
                <div className="col-span-3 flex items-center gap-4">
                  <Slider
                    id="progress"
                    min={0}
                    max={100}
                    step={5}
                    value={[progress]}
                    onValueChange={(value) => setProgress(value[0])}
                    className="flex-1"
                  />
                  <span className="w-12 text-right">{progress}%</span>
                </div>
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit}>{isEditMode ? 'Save Changes' : 'Create Project'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
