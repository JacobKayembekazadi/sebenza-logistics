

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useData } from '@/contexts/data-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TaskList } from '@/components/tasks/task-list';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { ProjectFormDialog } from '@/components/projects/project-form-dialog';
import { DeleteConfirmationDialog } from '@/components/common/delete-confirmation-dialog';
import type { Project, Invoice } from '@/lib/data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

type EffectiveStatus = Invoice['status'] | 'Overdue';

export default function ProjectDetailPage() {
  const params = useParams();
  const { projects, deleteProject, invoices } = useData();
  const router = useRouter();

  const [isFormOpen, setFormOpen] = useState(false);
  const [isConfirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [today, setToday] = useState<Date | null>(null);
  
  const project = projects.find((p) => p.id === params.id as string);

  useEffect(() => {
    if (!project) {
      router.push('/projects');
    }
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    setToday(d);
  }, [project, router]);
  
  if (!project) {
    return <p>Project not found. Redirecting...</p>;
  }

  const handleDelete = () => {
    deleteProject(project.id);
    router.push('/projects');
  };

  const projectInvoices = invoices.filter(inv => inv.projectId === project.id);

  const getEffectiveStatus = (invoice: Invoice): EffectiveStatus => {
    if (invoice.status === 'Paid') {
      return 'Paid';
    }
    
    if (!today) {
      return invoice.status;
    }
    const dueDate = new Date(invoice.date);

    if (dueDate < today) {
      return 'Overdue';
    }
    
    return invoice.status;
  };

  return (
    <>
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
            <p className="text-muted-foreground">{project.location}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setFormOpen(true)}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </Button>
            <Button variant="destructive" size="sm" onClick={() => setConfirmDeleteOpen(true)}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Project Progress</CardTitle>
            <CardDescription>{project.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">Overall Progress</span>
                <span className="text-sm font-bold">{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-3" />
            </div>
          </CardContent>
        </Card>
        
        <TaskList projectId={project.id} />

        <Card>
            <CardHeader>
                <CardTitle>Associated Invoices</CardTitle>
                <CardDescription>Invoices linked to this project.</CardDescription>
            </CardHeader>
            <CardContent>
                {projectInvoices.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Invoice ID</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                                <TableHead className="text-right">Balance Due</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {projectInvoices.map((invoice) => {
                                const effectiveStatus = getEffectiveStatus(invoice);
                                const totalAmount = invoice.amount + (invoice.tax || 0) - (invoice.discount || 0) + (invoice.lateFee || 0);
                                const balanceDue = totalAmount - (invoice.paidAmount || 0);
                                return (
                                    <TableRow key={invoice.id}>
                                        <TableCell className="font-medium">
                                          <Link href={`/invoices`} className="hover:underline">
                                            {invoice.id}
                                          </Link>
                                        </TableCell>
                                        <TableCell>{invoice.date}</TableCell>
                                        <TableCell>
                                            <Badge variant={
                                              effectiveStatus === 'Paid' ? 'outline' :
                                              effectiveStatus === 'Overdue' ? 'destructive' :
                                              effectiveStatus === 'Partial' ? 'secondary' :
                                              'default'
                                            } className={
                                              effectiveStatus === 'Paid' ? 'bg-accent text-accent-foreground' :
                                              effectiveStatus === 'Partial' ? 'bg-yellow-200 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' : ''
                                            }>
                                              {effectiveStatus}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">${totalAmount.toFixed(2)}</TableCell>
                                        <TableCell className="text-right font-medium">${balanceDue.toFixed(2)}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                        No invoices have been associated with this project.
                    </p>
                )}
            </CardContent>
        </Card>

      </div>

      <ProjectFormDialog
        open={isFormOpen}
        onOpenChange={setFormOpen}
        project={project}
      />
      <DeleteConfirmationDialog
        open={isConfirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        onConfirm={handleDelete}
        title="Are you sure you want to delete this project?"
        description="This will also delete all associated tasks. This action cannot be undone."
      />
    </>
  );
}
