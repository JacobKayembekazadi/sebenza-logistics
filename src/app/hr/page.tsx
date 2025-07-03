
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusCircle, ShieldAlert } from 'lucide-react';
import { useData } from '@/contexts/data-context';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { JobPosting } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { JobFormDialog } from '@/components/hr/job-form-dialog';
import { DeleteConfirmationDialog } from '@/components/common/delete-confirmation-dialog';
import { useAuth } from '@/contexts/auth-context';

export default function HRPage() {
  const { jobPostings, deleteJobPosting } = useData();
  const { user } = useAuth();
  const [isFormOpen, setFormOpen] = useState(false);
  const [isConfirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPosting | undefined>(undefined);

  if (user?.role !== 'admin') {
    return (
        <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
            <ShieldAlert className="w-16 h-16 text-destructive" />
            <h1 className="text-2xl font-bold">Access Denied</h1>
            <p className="text-muted-foreground">You do not have permission to view this page.</p>
        </div>
    );
  }

  const handleEdit = (job: JobPosting) => {
    setSelectedJob(job);
    setFormOpen(true);
  };

  const handleDelete = (job: JobPosting) => {
    setSelectedJob(job);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedJob) {
      deleteJobPosting(selectedJob.id);
      setConfirmDeleteOpen(false);
      setSelectedJob(undefined);
    }
  };
  
  const openAddDialog = () => {
    setSelectedJob(undefined);
    setFormOpen(true);
  }

  const statusVariant: { [key: string]: "default" | "secondary" | "destructive" } = {
    'Open': 'default',
    'Closed': 'secondary',
    'Archived': 'destructive',
  };

  return (
    <>
      <div className="flex flex-col gap-8">
        <h1 className="text-3xl font-bold tracking-tight">Human Resources</h1>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Job Postings</CardTitle>
              <CardDescription>Manage open positions and recruitment pipelines.</CardDescription>
            </div>
            <Button size="sm" onClick={openAddDialog}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Job Posting
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobPostings.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.title}</TableCell>
                    <TableCell>{job.department}</TableCell>
                    <TableCell>{job.location}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[job.status]}>{job.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(job)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(job)} className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <JobFormDialog
        open={isFormOpen}
        onOpenChange={setFormOpen}
        job={selectedJob}
      />
      <DeleteConfirmationDialog
        open={isConfirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        onConfirm={confirmDelete}
        title="Are you sure you want to delete this job posting?"
        description="This action cannot be undone. This will permanently remove the job posting."
      />
    </>
  );
}
