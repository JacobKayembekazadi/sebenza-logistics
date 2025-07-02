
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
import type { Task } from "@/lib/data";
import { useEffect, useState } from "react";

interface TaskFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  task?: Task;
}

export function TaskFormDialog({ open, onOpenChange, projectId, task }: TaskFormDialogProps) {
    const { addTask, updateTask } = useData();
    const [name, setName] = useState('');
    const [assignee, setAssignee] = useState('');
    const [dueDate, setDueDate] = useState('');

    const isEditMode = !!task;

    useEffect(() => {
      if (task) {
        setName(task.name);
        setAssignee(task.assignee);
        setDueDate(task.dueDate);
      } else {
        setName('');
        setAssignee('');
        setDueDate(new Date().toISOString().split('T')[0]);
      }
    }, [task, open]);

    const handleSubmit = () => {
        if (name && assignee && dueDate) {
            const taskData = { name, assignee, dueDate, projectId };
            if (isEditMode && task) {
              updateTask({ ...task, ...taskData });
            } else {
              addTask({ ...taskData, status: 'PENDING' });
            }
            onOpenChange(false);
        }
    };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Task' : 'Add New Task'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Update the task details below." : "Fill in the details below to add a new task to the project."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Task
            </Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" placeholder="e.g., 'Pack shipment containers'" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="assignee" className="text-right">
              Assignee
            </Label>
            <Input id="assignee" value={assignee} onChange={(e) => setAssignee(e.target.value)} className="col-span-3" placeholder="e.g., 'John Doe'" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dueDate" className="text-right">
              Due Date
            </Label>
            <Input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit}>{isEditMode ? 'Save Changes' : 'Add Task'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
