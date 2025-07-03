
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { useData } from '@/contexts/data-context';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { Supplier } from '@/lib/data';
import { DeleteConfirmationDialog } from '@/components/common/delete-confirmation-dialog';
import { SupplierFormDialog } from '@/components/suppliers/supplier-form-dialog';

export default function SuppliersPage() {
  const { suppliers, deleteSupplier } = useData();
  const [isFormOpen, setFormOpen] = useState(false);
  const [isConfirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | undefined>(undefined);

  const handleEdit = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setFormOpen(true);
  };

  const handleDelete = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedSupplier) {
      deleteSupplier(selectedSupplier.id);
      setConfirmDeleteOpen(false);
      setSelectedSupplier(undefined);
    }
  };

  const openAddDialog = () => {
    setSelectedSupplier(undefined);
    setFormOpen(true);
  };

  return (
    <>
      <div className="flex flex-col gap-8">
        <h1 className="text-3xl font-bold tracking-tight">Suppliers</h1>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>All Suppliers</CardTitle>
              <CardDescription>Manage your supplier information.</CardDescription>
            </div>
            <Button size="sm" onClick={openAddDialog}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Supplier
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Supplier Name</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>Contact Info</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium">{supplier.name}</TableCell>
                    <TableCell>{supplier.contactPerson}</TableCell>
                    <TableCell>
                      <div>
                        <p>{supplier.email}</p>
                        <p className="text-sm text-muted-foreground">{supplier.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(supplier)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(supplier)} className="text-destructive">Delete</DropdownMenuItem>
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

      <SupplierFormDialog
        open={isFormOpen}
        onOpenChange={setFormOpen}
        supplier={selectedSupplier}
      />
      <DeleteConfirmationDialog
        open={isConfirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        onConfirm={confirmDelete}
        title="Are you sure you want to delete this supplier?"
        description="This action cannot be undone. This will permanently remove the supplier's information."
      />
    </>
  );
}
