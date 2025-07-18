
'use client';

import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '../ui/button';
import { MoreHorizontal, Bot, Pencil, Trash2 } from 'lucide-react';
import { UpdateTaskStatusDialog } from './update-task-status-dialog';
import type { Task } from '@/lib/data';

interface TaskActionsProps {
  task: Task;
  onStatusUpdate: (taskId: string, newStatus: string) => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function TaskActions({ task, onStatusUpdate, onEdit, onDelete }: TaskActionsProps) {
  const [isUpdateDialogOpen, setUpdateDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={onEdit}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Task
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setUpdateDialogOpen(true)}>
            <Bot className="mr-2 h-4 w-4" />
            Update Status (AI)
          </DropdownMenuItem>
          <DropdownMenuItem>Assign User</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onDelete} className="text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <UpdateTaskStatusDialog
        task={task}
        open={isUpdateDialogOpen}
        onOpenChange={setUpdateDialogOpen}
        onStatusUpdate={onStatusUpdate}
      />
    </>
  );
}
