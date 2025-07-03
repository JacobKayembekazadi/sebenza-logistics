
'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { useData } from "@/contexts/data-context";
import type { Estimate } from "@/lib/data";
import { DeleteConfirmationDialog } from "@/components/common/delete-confirmation-dialog";
import { EstimateFormDialog } from "@/components/estimates/estimate-form-dialog";
import { useToast } from "@/hooks/use-toast";

export default function EstimatesPage() {
  const { estimates, deleteEstimate, addInvoice } = useData();
  const router = useRouter();
  const { toast } = useToast();
  const [isFormOpen, setFormOpen] = useState(false);
  const [isConfirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedEstimate, setSelectedEstimate] = useState<Estimate | undefined>(undefined);

  const handleEdit = (estimate: Estimate) => {
    setSelectedEstimate(estimate);
    setFormOpen(true);
  };

  const handleDelete = (estimate: Estimate) => {
    setSelectedEstimate(estimate);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedEstimate) {
      deleteEstimate(selectedEstimate.id);
      setConfirmDeleteOpen(false);
      setSelectedEstimate(undefined);
    }
  };

  const openAddDialog = () => {
    setSelectedEstimate(undefined);
    setFormOpen(true);
  };

  const handleConvertToInvoice = (estimate: Estimate) => {
    addInvoice({
      client: estimate.client,
      amount: estimate.amount,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0]
    });
    toast({
      title: "Invoice Created",
      description: `Estimate ${estimate.estimateNumber} has been converted to a new invoice.`
    });
    router.push('/invoices');
  };

  const statusVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
    'Draft': 'secondary',
    'Sent': 'default',
    'Accepted': 'outline',
    'Declined': 'destructive',
  };

  const statusStyle : { [key: string]: string } = {
    'Accepted': 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700',
  }

  return (
    <>
      <div className="flex flex-col gap-8">
        <h1 className="text-3xl font-bold tracking-tight">Estimates</h1>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>All Estimates</CardTitle>
              <CardDescription>A list of all your estimates.</CardDescription>
            </div>
            <Button size="sm" onClick={openAddDialog}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Estimate
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estimate #</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {estimates.map((estimate) => (
                  <TableRow key={estimate.id}>
                    <TableCell className="font-medium">{estimate.estimateNumber}</TableCell>
                    <TableCell>{estimate.client}</TableCell>
                    <TableCell>{estimate.date}</TableCell>
                    <TableCell>
                       <Badge variant={statusVariant[estimate.status]} className={statusStyle[estimate.status]}>
                        {estimate.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">${estimate.amount.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(estimate)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleConvertToInvoice(estimate)}
                            disabled={estimate.status !== 'Accepted'}
                          >
                            Convert to Invoice
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDelete(estimate)} className="text-destructive">Delete</DropdownMenuItem>
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
      <EstimateFormDialog
        open={isFormOpen}
        onOpenChange={setFormOpen}
        estimate={selectedEstimate}
      />
      <DeleteConfirmationDialog
        open={isConfirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        onConfirm={confirmDelete}
        title="Are you sure you want to delete this estimate?"
        description="This action cannot be undone. This will permanently delete the estimate."
      />
    </>
  );
}
