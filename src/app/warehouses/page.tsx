
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { useData } from '@/contexts/data-context';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { Warehouse } from '@/lib/data';
import { DeleteConfirmationDialog } from '@/components/common/delete-confirmation-dialog';
import { WarehouseFormDialog } from '@/components/warehouses/warehouse-form-dialog';

export default function WarehousesPage() {
  const { warehouses, deleteWarehouse } = useData();
  const [isFormOpen, setFormOpen] = useState(false);
  const [isConfirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | undefined>(undefined);

  const handleEdit = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    setFormOpen(true);
  };

  const handleDelete = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedWarehouse) {
      deleteWarehouse(selectedWarehouse.id);
      setConfirmDeleteOpen(false);
      setSelectedWarehouse(undefined);
    }
  };

  const openAddDialog = () => {
    setSelectedWarehouse(undefined);
    setFormOpen(true);
  };

  return (
    <>
      <div className="flex flex-col gap-8">
        <h1 className="text-3xl font-bold tracking-tight">Warehouse Management</h1>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>All Warehouses</CardTitle>
              <CardDescription>Manage your physical and virtual warehouse locations.</CardDescription>
            </div>
            <Button size="sm" onClick={openAddDialog}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Warehouse
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Warehouse Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {warehouses.map((warehouse) => (
                  <TableRow key={warehouse.id}>
                    <TableCell className="font-medium">{warehouse.name}</TableCell>
                    <TableCell>{warehouse.location}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(warehouse)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(warehouse)} className="text-destructive">Delete</DropdownMenuItem>
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

      <WarehouseFormDialog
        open={isFormOpen}
        onOpenChange={setFormOpen}
        warehouse={selectedWarehouse}
      />
      <DeleteConfirmationDialog
        open={isConfirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        onConfirm={confirmDelete}
        title="Are you sure you want to delete this warehouse?"
        description="This action cannot be undone. This will permanently remove the warehouse location."
      />
    </>
  );
}
