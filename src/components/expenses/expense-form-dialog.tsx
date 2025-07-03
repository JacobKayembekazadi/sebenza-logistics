
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useData } from "@/contexts/data-context";
import type { Expense } from "@/lib/data";
import { useEffect, useState } from "react";
import { Textarea } from "../ui/textarea";

interface ExpenseFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expense?: Expense;
}

const expenseCategories = ['Office Supplies', 'Software', 'Travel', 'Utilities', 'Marketing', 'Other', 'Materials', 'Subcontractor'];

export function ExpenseFormDialog({ open, onOpenChange, expense }: ExpenseFormDialogProps) {
  const { addExpense, updateExpense, clients, projects } = useData();
  const [category, setCategory] = useState(expenseCategories[0]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [clientId, setClientId] = useState<string | undefined>('');
  const [projectId, setProjectId] = useState<string | undefined>('');
  const [isBillable, setIsBillable] = useState(false);
  
  const isEditMode = !!expense;

  useEffect(() => {
    if (expense) {
      setCategory(expense.category);
      setDescription(expense.description);
      setAmount(expense.amount.toString());
      setDate(expense.date);
      setClientId(expense.clientId || '');
      setProjectId(expense.projectId || '');
      setIsBillable(expense.isBillable || false);
    } else {
      setCategory(expenseCategories[0]);
      setDescription('');
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      setClientId('');
      setProjectId('');
      setIsBillable(false);
    }
  }, [expense, open]);

  const handleSubmit = () => {
    const expenseData = { 
      category,
      description, 
      amount: parseFloat(amount),
      date,
      clientId: clientId || undefined,
      projectId: projectId || undefined,
      isBillable
    };

    if (isEditMode && expense) {
      updateExpense({ ...expense, ...expenseData });
    } else {
      addExpense(expenseData);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Expense' : 'Add New Expense'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Update the details of the expense below.' : 'Fill in the details below to add a new expense.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto px-2">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">Category</Label>
            <Select onValueChange={setCategory} value={category}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {expenseCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right pt-2">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">Amount</Label>
            <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">Date</Label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="client" className="text-right">Client</Label>
            <Select onValueChange={value => setClientId(value === 'none' ? '' : value)} value={clientId || 'none'}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Assign to client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">(None)</SelectItem>
                {clients.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="project" className="text-right">Project</Label>
            <Select onValueChange={value => setProjectId(value === 'none' ? '' : value)} value={projectId || 'none'}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Assign to project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">(None)</SelectItem>
                {projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="receipt" className="text-right">Receipt</Label>
            <Input id="receipt" type="file" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Billable</Label>
            <div className="col-span-3 flex items-center">
              <Switch id="isBillable" checked={isBillable} onCheckedChange={setIsBillable} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit}>{isEditMode ? 'Save Changes' : 'Add Expense'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
