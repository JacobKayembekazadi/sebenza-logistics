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
import { AddTaskDialog } from './add-task-dialog';

interface TaskListProps {
  initialTasks: Task[];
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

export function TaskList({ initialTasks }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);

  const handleAddTask = (newTask: Omit<Task, 'id' | 'projectId'>) => {
    const createdTask: Task = {
      ...newTask,
      id: `task-${Date.now()}`,
      projectId: 'proj-1', // This should be dynamic in a real app
    };
    setTasks(prevTasks => [createdTask, ...prevTasks]);
  };
  
  const handleUpdateTask = (taskId: string, newStatus: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus as Task['status'] } : task
      )
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Tasks</CardTitle>
        <Button size="sm" onClick={() => setAddDialogOpen(true)}>
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
                  <TaskActions task={task} onStatusUpdate={handleUpdateTask} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <AddTaskDialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen} onAddTask={handleAddTask} />
    </Card>
  );
}
