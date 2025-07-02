
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { handleUpdateTaskStatus } from '@/app/actions';
import { Loader2 } from 'lucide-react';
import type { Task } from '@/lib/data';
import { useData } from '@/contexts/data-context';

interface UpdateTaskStatusDialogProps {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusUpdate: (taskId: string, newStatus: string) => void;
}

export function UpdateTaskStatusDialog({
  task,
  open,
  onOpenChange,
  onStatusUpdate,
}: UpdateTaskStatusDialogProps) {
  const [nlpText, setNlpText] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  const { updateTask } = useData();

  const handleSubmit = async () => {
    if (!nlpText.trim()) return;

    setIsUpdating(true);
    try {
      const result = await handleUpdateTaskStatus({
        taskId: task.id,
        statusUpdateNLP: nlpText,
      });

      if (result.error) {
        throw new Error(result.error);
      }
      
      const newStatus = result.updatedStatus! as Task['status'];
      
      // Update state via context
      updateTask({ ...task, status: newStatus });
      
      toast({
        title: 'Status Updated',
        description: `Task "${task.name}" status updated to ${newStatus}.`,
      });
      onOpenChange(false);
      setNlpText('');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description:
          error instanceof Error ? error.message : 'An unknown error occurred.',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Task Status with AI</DialogTitle>
          <DialogDescription>
            Describe the status update in plain English. For example, "Mark as done"
            or "Reschedule to next week."
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nlp-input" className="text-right">
              Update
            </Label>
            <Input
              id="nlp-input"
              value={nlpText}
              onChange={(e) => setNlpText(e.target.value)}
              className="col-span-3"
              placeholder="e.g., 'Completed this task'"
            />
          </div>
        </div>
        <DialogFooter>
           <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isUpdating}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit} disabled={isUpdating}>
            {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isUpdating ? 'Updating...' : 'Update Status'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
