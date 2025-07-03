
'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle, CheckCircle, XCircle } from "lucide-react";
import { useData } from "@/contexts/data-context";
import type { Expense } from "@/lib/data";
import { DeleteConfirmationDialog } from "@/components/common/delete-confirmation-dialog";
import { ExpenseFormDialog } from "@/components/expenses/expense-form-dialog";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function ExpensesPage() {
  const { expenses, deleteExpense, clients, projects } = useData();
  const [isFormOpen, setFormOpen] = useState(false);
  const [isConfirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | undefined>(undefined);

  const handleEdit = (expense: Expense) => {
    setSelectedExpense(expense);
    setFormOpen(true);
  };

  const handleDelete = (expense: Expense) => {
    setSelectedExpense(expense);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedExpense) {
      deleteExpense(selectedExpense.id);
      setConfirmDeleteOpen(false);
      setSelectedExpense(undefined);
    }
  };

  const openAddDialog = () => {
    setSelectedExpense(undefined);
    setFormOpen(true);
  };

  return (
    <>
      <div className="flex flex-col gap-8">
        <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>All Expenses</CardTitle>
              <CardDescription>A list of all your business expenses.</CardDescription>
            </div>
            <Button size="sm" onClick={openAddDialog}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Expense
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Related To</TableHead>
                  <TableHead>Billable</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense) => {
                  const client = expense.clientId ? clients.find(c => c.id === expense.clientId) : null;
                  const project = expense.projectId ? projects.find(p => p.id === expense.projectId) : null;

                  return (
                    <TableRow key={expense.id}>
                      <TableCell><Badge variant="secondary">{expense.category}</Badge></TableCell>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell>{expense.date}</TableCell>
                      <TableCell>
                        {client ? <Link href={`/clients/${client.id}`} className="hover:underline">{client.name}</Link> :
                         project ? <Link href={`/projects/${project.id}`} className="hover:underline">{project.name}</Link> :
                         <span className="text-muted-foreground">N/A</span>
                        }
                      </TableCell>
                      <TableCell>
                        {expense.isBillable ? <CheckCircle className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-muted-foreground" />}
                      </TableCell>
                      <TableCell className="text-right font-medium">${expense.amount.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(expense)}>Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(expense)} className="text-destructive">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <ExpenseFormDialog
        open={isFormOpen}
        onOpenChange={setFormOpen}
        expense={selectedExpense}
      />
      <DeleteConfirmationDialog
        open={isConfirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        onConfirm={confirmDelete}
        title="Are you sure you want to delete this expense?"
        description="This action cannot be undone. This will permanently delete the expense record."
      />
    </>
  );
}
