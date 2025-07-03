
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
import { Switch } from "@/components/ui/switch";
import { useData } from "@/contexts/data-context";
import type { Employee } from "@/lib/data";
import { useEffect, useState } from "react";

interface EmployeeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee?: Employee;
}

export function EmployeeFormDialog({ open, onOpenChange, employee }: EmployeeFormDialogProps) {
  const { addEmployee, updateEmployee } = useData();
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('');
  const [email, setEmail] = useState('');
  const [timesheetEnabled, setTimesheetEnabled] = useState(true);
  const [payrollManaged, setPayrollManaged] = useState(true);
  
  const isEditMode = !!employee;

  useEffect(() => {
    if (employee) {
      setName(employee.name);
      setRole(employee.role);
      setDepartment(employee.department);
      setEmail(employee.email);
      setTimesheetEnabled(employee.timesheetEnabled);
      setPayrollManaged(employee.payrollManaged);
    } else {
      setName('');
      setRole('');
      setDepartment('');
      setEmail('');
      setTimesheetEnabled(true);
      setPayrollManaged(true);
    }
  }, [employee, open]);

  const handleSubmit = () => {
    const employeeData = { name, role, department, email, avatar: 'https://placehold.co/100x100.png', timesheetEnabled, payrollManaged };
    
    if (isEditMode && employee) {
      updateEmployee({ ...employee, ...employeeData });
    } else {
      addEmployee(employeeData);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Employee' : 'Add New Employee'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Update the details of the employee below.' : 'Fill in the details below to add a new employee.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">Role</Label>
            <Input id="role" value={role} onChange={(e) => setRole(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="department" className="text-right">Department</Label>
            <Input id="department" value={department} onChange={(e) => setDepartment(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="timesheet" className="text-right">Timesheet</Label>
            <div className="col-span-3 flex items-center gap-2">
                <Switch id="timesheet" checked={timesheetEnabled} onCheckedChange={setTimesheetEnabled} />
                <span className="text-sm text-muted-foreground">Enable Timesheet</span>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="payroll" className="text-right">Payroll</Label>
             <div className="col-span-3 flex items-center gap-2">
                <Switch id="payroll" checked={payrollManaged} onCheckedChange={setPayrollManaged} />
                <span className="text-sm text-muted-foreground">Manage Payroll</span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit}>{isEditMode ? 'Save Changes' : 'Add Employee'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
