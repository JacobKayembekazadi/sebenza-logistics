
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useData } from '@/contexts/data-context';
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import type { Payment } from "@/lib/data";
import { DeleteConfirmationDialog } from "@/components/common/delete-confirmation-dialog";
import { PaymentFormDialog } from "@/components/payments/payment-form-dialog";

export default function PaymentsPage() {
  const { payments, deletePayment } = useData();
  const [isFormOpen, setFormOpen] = useState(false);
  const [isConfirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | undefined>(undefined);

  const handleEdit = (payment: Payment) => {
    setSelectedPayment(payment);
    setFormOpen(true);
  };

  const handleDelete = (payment: Payment) => {
    setSelectedPayment(payment);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedPayment) {
      deletePayment(selectedPayment.id);
      setConfirmDeleteOpen(false);
      setSelectedPayment(undefined);
    }
  };
  
  return (
    <>
      <div className="flex flex-col gap-8">
        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>A complete log of all recorded payments.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No payments have been recorded yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.date}</TableCell>
                      <TableCell>
                        <Link href="/invoices" className="font-medium text-primary hover:underline">
                          {payment.invoiceId}
                        </Link>
                      </TableCell>
                      <TableCell>{payment.clientName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{payment.method}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">${payment.amount.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(payment)}>Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(payment)} className="text-destructive">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <PaymentFormDialog
        open={isFormOpen}
        onOpenChange={setFormOpen}
        payment={selectedPayment}
      />
      <DeleteConfirmationDialog
        open={isConfirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        onConfirm={confirmDelete}
        title="Are you sure you want to delete this payment?"
        description="This action cannot be undone. This will permanently delete the payment record and update the invoice balance."
      />
    </>
  );
}
