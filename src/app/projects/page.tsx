
'use client';

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, PlusCircle, Trash2 } from "lucide-react"
import { useData } from "@/contexts/data-context";
import { ProjectFormDialog } from "@/components/projects/project-form-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DeleteConfirmationDialog } from "@/components/common/delete-confirmation-dialog";
import type { Project } from "@/lib/data";

export default function ProjectsPage() {
  const { projects, deleteProject } = useData();
  const [isFormOpen, setFormOpen] = useState(false);
  const [isConfirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | undefined>(undefined);

  const handleDelete = (project: Project) => {
    setSelectedProject(project);
    setConfirmDeleteOpen(true);
  }

  const confirmDelete = () => {
    if (selectedProject) {
      deleteProject(selectedProject.id);
      setConfirmDeleteOpen(false);
      setSelectedProject(undefined);
    }
  }

  return (
    <>
      <div className="flex flex-col gap-8">
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>All Projects</CardTitle>
              <CardDescription>A list of all projects, including active and completed ones.</CardDescription>
            </div>
            <Button size="sm" onClick={() => setFormOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Project
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Progress</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">
                      <Link href={`/projects/${project.id}`} className="hover:underline">
                        {project.name}
                      </Link>
                    </TableCell>
                    <TableCell>{project.location}</TableCell>
                    <TableCell>
                      <Badge variant={project.status === 'Completed' ? 'secondary' : 'default'}>
                        {project.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{project.progress}%</TableCell>
                    <TableCell className="text-right">
                       <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                           <DropdownMenuItem asChild>
                             <Link href={`/projects/${project.id}`}>View Details</Link>
                           </DropdownMenuItem>
                           <DropdownMenuItem onClick={() => handleDelete(project)} className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                           </DropdownMenuItem>
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
      <ProjectFormDialog open={isFormOpen} onOpenChange={setFormOpen} />
      <DeleteConfirmationDialog
        open={isConfirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        onConfirm={confirmDelete}
        title="Are you sure you want to delete this project?"
        description="This will also delete all associated tasks. This action cannot be undone."
      />
    </>
  );
}
