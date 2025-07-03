
'use client';

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { useData } from "@/contexts/data-context";
import type { Invoice } from "@/lib/data";
import { DeleteConfirmationDialog } from "@/components/common/delete-confirmation-dialog";
import { InvoiceFormDialog } from "@/components/invoices/invoice-form-dialog";

type EffectiveStatus = Invoice['status'] | 'Overdue';

export default function InvoicesPage() {
  const { invoices, deleteInvoice, projects } = useData();
  const [isFormOpen, setFormOpen] = useState(false);
  const [isConfirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | undefined>(undefined);

  const handleEdit = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setFormOpen(true);
  };

  const handleDelete = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedInvoice) {
      deleteInvoice(selectedInvoice.id);
      setConfirmDeleteOpen(false);
      setSelectedInvoice(undefined);
    }
  };

  const openAddDialog = () => {
    setSelectedInvoice(undefined);
    setFormOpen(true);
  };

  const getEffectiveStatus = (invoice: Invoice): EffectiveStatus => {
    if (invoice.status === 'Paid') {
      return 'Paid';
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(invoice.date);

    if (dueDate < today) {
      return 'Overdue';
    }
    
    return invoice.status;
  };

  return (
    <>
      <div className="flex flex-col gap-8">
        <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>All Invoices</CardTitle>
              <CardDescription>A list of all your invoices.</CardDescription>
            </div>
            <Button size="sm" onClick={openAddDialog}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Invoice
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => {
                  const effectiveStatus = getEffectiveStatus(invoice);
                  const projectName = invoice.projectId ? projects.find(p => p.id === invoice.projectId)?.name : null;
                  return (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.id}</TableCell>
                      <TableCell>{invoice.client}</TableCell>
                      <TableCell>
                        {invoice.projectId && projectName ? (
                          <Link href={`/projects/${invoice.projectId}`} className="hover:underline">
                            {projectName}
                          </Link>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
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
                      <TableCell className="text-right">${invoice.amount.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(invoice)}>Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(invoice)} className="text-destructive">Delete</DropdownMenuItem>
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
      <InvoiceFormDialog
        open={isFormOpen}
        onOpenChange={setFormOpen}
        invoice={selectedInvoice}
      />
      <DeleteConfirmationDialog
        open={isConfirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        onConfirm={confirmDelete}
        title="Are you sure you want to delete this invoice?"
        description="This action cannot be undone. This will permanently delete the invoice."
      />
    </>
  );
}
