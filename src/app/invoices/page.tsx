

'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle, Bot, Loader2, Paperclip, Mail, Wallet } from "lucide-react";
import { useData } from "@/contexts/data-context";
import type { Invoice } from "@/lib/data";
import { DeleteConfirmationDialog } from "@/components/common/delete-confirmation-dialog";
import { InvoiceFormDialog } from "@/components/invoices/invoice-form-dialog";
import { handleCalculateLateFee } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PaymentFormDialog } from "@/components/payments/payment-form-dialog";

type EffectiveStatus = Invoice['status'] | 'Overdue';

export default function InvoicesPage() {
  const { invoices, deleteInvoice, projects, updateInvoice, documents } = useData();
  const [isFormOpen, setFormOpen] = useState(false);
  const [isConfirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [isPaymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | undefined>(undefined);
  const [isApplyingFee, setIsApplyingFee] = useState<string | null>(null);
  const [today, setToday] = useState<Date | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    setToday(d);
  }, []);

  const handleEdit = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setFormOpen(true);
  };

  const handleDelete = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setConfirmDeleteOpen(true);
  };
  
  const handleRecordPayment = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setPaymentDialogOpen(true);
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
    
    if (!today) {
      return invoice.status;
    }
    const dueDate = new Date(invoice.date);

    if (dueDate < today) {
      return 'Overdue';
    }
    
    return invoice.status;
  };

  const handleApplyLateFee = async (invoice: Invoice) => {
    setIsApplyingFee(invoice.id);
    const result = await handleCalculateLateFee({
        amount: invoice.amount,
        date: invoice.date
    });

    if (result.error) {
        toast({
            variant: "destructive",
            title: "Error Calculating Fee",
            description: result.error,
        });
    } else if (result.lateFee !== undefined) {
        updateInvoice({ ...invoice, lateFee: (invoice.lateFee || 0) + result.lateFee });
        toast({
            title: "Late Fee Calculated",
            description: `A late fee of $${result.lateFee.toFixed(2)} has been added to invoice ${invoice.id}.`
        });
    }
    setIsApplyingFee(null);
  };

  const handleSendReminder = (invoice: Invoice) => {
    toast({
        title: "Reminder Sent",
        description: `An email reminder has been sent for invoice ${invoice.id}.`
    });
  };

  const getRelatedDocumentsCount = (invoiceId: string) => {
    return documents.filter(doc => doc.relatedTo === invoiceId).length;
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
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Attachments</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Paid</TableHead>
                  <TableHead className="text-right">Balance Due</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => {
                  const effectiveStatus = getEffectiveStatus(invoice);
                  const totalAmount = invoice.amount + (invoice.tax || 0) - (invoice.discount || 0) + (invoice.lateFee || 0);
                  const paidAmount = invoice.paidAmount || 0;
                  const balanceDue = totalAmount - paidAmount;
                  const attachmentsCount = getRelatedDocumentsCount(invoice.id);

                  return (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.id}</TableCell>
                      <TableCell>
                         <Link href={`/clients/${projects.find(p => p.id === invoice.projectId)?.name}`} className="hover:underline">
                           {invoice.client}
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
                      <TableCell>
                        {attachmentsCount > 0 && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Link href="/documents" className="flex items-center gap-1 text-muted-foreground">
                                  <Paperclip className="h-4 w-4" />
                                  <span>{attachmentsCount}</span>
                                </Link>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{attachmentsCount} document(s) attached.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </TableCell>
                      <TableCell className="text-right">${totalAmount.toFixed(2)}</TableCell>
                      <TableCell className="text-right text-green-600">${paidAmount.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-medium">${balanceDue.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(invoice)}>Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRecordPayment(invoice)} disabled={balanceDue <= 0}>
                              <Wallet className="mr-2 h-4 w-4" />
                              Record Payment
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                onClick={() => handleApplyLateFee(invoice)} 
                                disabled={effectiveStatus !== 'Overdue' || !!isApplyingFee}
                            >
                                {isApplyingFee === invoice.id ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Bot className="mr-2 h-4 w-4" />
                                )}
                                Apply Late Fee (AI)
                            </DropdownMenuItem>
                             <DropdownMenuItem
                                onClick={() => handleSendReminder(invoice)}
                                disabled={effectiveStatus === 'Paid'}
                            >
                                <Mail className="mr-2 h-4 w-4" />
                                Send Reminder
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
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
      <PaymentFormDialog
        open={isPaymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
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
