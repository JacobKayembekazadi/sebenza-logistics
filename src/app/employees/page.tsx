
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, MoreHorizontal, PlusCircle, ShieldAlert, XCircle } from 'lucide-react';
import { useData } from '@/contexts/data-context';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { EmployeeFormDialog } from '@/components/employees/employee-form-dialog';
import { DeleteConfirmationDialog } from '@/components/common/delete-confirmation-dialog';
import type { Employee } from '@/lib/data';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';

export default function EmployeesPage() {
  const { employees, deleteEmployee } = useData();
  const { user } = useAuth();
  const router = useRouter();
  const [isFormOpen, setFormOpen] = useState(false);
  const [isConfirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | undefined>(undefined);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user || user.role !== 'admin') {
    return (
        <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
            <ShieldAlert className="w-16 h-16 text-destructive" />
            <h1 className="text-2xl font-bold">Access Denied</h1>
            <p className="text-muted-foreground">You do not have permission to view this page.</p>
        </div>
    );
  }

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setFormOpen(true);
  };

  const handleDelete = (employee: Employee) => {
    setSelectedEmployee(employee);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedEmployee) {
      deleteEmployee(selectedEmployee.id);
      setConfirmDeleteOpen(false);
      setSelectedEmployee(undefined);
    }
  };
  
  const openAddDialog = () => {
    setSelectedEmployee(undefined);
    setFormOpen(true);
  }

  return (
    <>
      <div className="flex flex-col gap-8">
        <h1 className="text-3xl font-bold tracking-tight">Employee Management</h1>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>All Employees</CardTitle>
              <CardDescription>Browse and manage employee profiles.</CardDescription>
            </div>
            <Button size="sm" onClick={openAddDialog}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Timesheet</TableHead>
                  <TableHead>Payroll</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={employee.avatar} data-ai-hint="person" />
                          <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{employee.name}</p>
                          <p className="text-sm text-muted-foreground">{employee.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{employee.role}</TableCell>
                    <TableCell>
                        {employee.timesheetEnabled ? <CheckCircle className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-muted-foreground" />}
                    </TableCell>
                    <TableCell>
                        {employee.payrollManaged ? <CheckCircle className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-muted-foreground" />}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(employee)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(employee)} className="text-destructive">Delete</DropdownMenuItem>
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

      <EmployeeFormDialog
        open={isFormOpen}
        onOpenChange={setFormOpen}
        employee={selectedEmployee}
      />
      <DeleteConfirmationDialog
        open={isConfirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        onConfirm={confirmDelete}
        title="Are you sure you want to delete this employee?"
        description="This action cannot be undone. This will permanently remove the employee's profile."
      />
    </>
  );
}
