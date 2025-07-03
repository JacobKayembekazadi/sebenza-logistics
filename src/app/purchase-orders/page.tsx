
'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { useData } from "@/contexts/data-context";
import type { PurchaseOrder } from "@/lib/data";
import { DeleteConfirmationDialog } from "@/components/common/delete-confirmation-dialog";
import { PurchaseOrderFormDialog } from "@/components/purchase-orders/po-form-dialog";

export default function PurchaseOrdersPage() {
  const { purchaseOrders, deletePurchaseOrder } = useData();
  const [isFormOpen, setFormOpen] = useState(false);
  const [isConfirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | undefined>(undefined);

  const handleEdit = (po: PurchaseOrder) => {
    setSelectedPO(po);
    setFormOpen(true);
  };

  const handleDelete = (po: PurchaseOrder) => {
    setSelectedPO(po);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedPO) {
      deletePurchaseOrder(selectedPO.id);
      setConfirmDeleteOpen(false);
      setSelectedPO(undefined);
    }
  };

  const openAddDialog = () => {
    setSelectedPO(undefined);
    setFormOpen(true);
  };

  const statusVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
    'Draft': 'secondary',
    'Sent': 'default',
    'Fulfilled': 'outline',
    'Cancelled': 'destructive',
  };

  const statusStyle: { [key: string]: string } = {
    'Fulfilled': 'bg-accent text-accent-foreground',
  };

  return (
    <>
      <div className="flex flex-col gap-8">
        <h1 className="text-3xl font-bold tracking-tight">Purchase Orders</h1>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>All Purchase Orders</CardTitle>
              <CardDescription>Create and manage purchase orders to suppliers.</CardDescription>
            </div>
            <Button size="sm" onClick={openAddDialog}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add PO
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>PO Number</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchaseOrders.map((po) => (
                  <TableRow key={po.id}>
                    <TableCell className="font-medium">{po.poNumber}</TableCell>
                    <TableCell>{po.supplierName}</TableCell>
                    <TableCell>{po.date}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[po.status]} className={statusStyle[po.status]}>
                        {po.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">${po.amount.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(po)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Send to Supplier</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(po)} className="text-destructive">Delete</DropdownMenuItem>
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
      <PurchaseOrderFormDialog
        open={isFormOpen}
        onOpenChange={setFormOpen}
        purchaseOrder={selectedPO}
      />
      <DeleteConfirmationDialog
        open={isConfirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        onConfirm={confirmDelete}
        title="Are you sure you want to delete this purchase order?"
        description="This action cannot be undone. This will permanently delete the PO."
      />
    </>
  );
}
