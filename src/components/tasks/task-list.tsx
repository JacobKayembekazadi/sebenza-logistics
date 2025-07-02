
'use client';

import { useState } from 'react';
import type { Task } from '@/lib/data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '../ui/button';
import { PlusCircle } from 'lucide-react';
import { TaskActions } from './task-actions';
import { useData } from '@/contexts/data-context';
import { TaskFormDialog } from './task-form-dialog';
import { DeleteConfirmationDialog } from '../common/delete-confirmation-dialog';

interface TaskListProps {
  projectId: string;
}

const statusVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  'PENDING': 'secondary',
  'IN_PROGRESS': 'default',
  'DONE': 'outline',
  'BLOCKED': 'destructive',
  'SCHEDULED': 'default'
};

const statusStyles: { [key: string]: string } = {
    'DONE': 'bg-accent text-accent-foreground border-green-500/50',
    'SCHEDULED': 'bg-blue-200/50 text-blue-800'
}

export function TaskList({ projectId }: TaskListProps) {
  const { getTasksByProjectId, updateTask, deleteTask } = useData();
  const tasks = getTasksByProjectId(projectId);

  const [isFormOpen, setFormOpen] = useState(false);
  const [isConfirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setFormOpen(true);
  }

  const handleDelete = (task: Task) => {
    setSelectedTask(task);
    setConfirmDeleteOpen(true);
  }

  const confirmDelete = () => {
    if (selectedTask) {
      deleteTask(selectedTask.id);
      setConfirmDeleteOpen(false);
      setSelectedTask(undefined);
    }
  }

  const openAddDialog = () => {
    setSelectedTask(undefined);
    setFormOpen(true);
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Tasks</CardTitle>
          <Button size="sm" onClick={openAddDialog}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.name}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[task.status] || 'default'} className={statusStyles[task.status]}>
                      {task.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>{task.assignee}</TableCell>
                  <TableCell>{task.dueDate}</TableCell>
                  <TableCell className="text-right">
                    <TaskActions 
                      task={task} 
                      onStatusUpdate={(taskId, newStatus) => updateTask({ ...task, status: newStatus as Task['status'] })}
                      onEdit={() => handleEdit(task)}
                      onDelete={() => handleDelete(task)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <TaskFormDialog 
        open={isFormOpen} 
        onOpenChange={setFormOpen} 
        task={selectedTask}
        projectId={projectId}
      />
      <DeleteConfirmationDialog
        open={isConfirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        onConfirm={confirmDelete}
        title="Are you sure you want to delete this task?"
        description="This action cannot be undone. This will permanently delete the task."
      />
    </>
  );
}
