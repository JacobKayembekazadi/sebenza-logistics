
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { useData } from '@/contexts/data-context';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { Service } from '@/lib/data';
import { DeleteConfirmationDialog } from '@/components/common/delete-confirmation-dialog';
import { ServiceFormDialog } from '@/components/services/service-form-dialog';

export default function ServicesPage() {
  const { services, deleteService } = useData();
  const [isFormOpen, setFormOpen] = useState(false);
  const [isConfirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | undefined>(undefined);

  const handleEdit = (service: Service) => {
    setSelectedService(service);
    setFormOpen(true);
  };

  const handleDelete = (service: Service) => {
    setSelectedService(service);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedService) {
      deleteService(selectedService.id);
      setConfirmDeleteOpen(false);
      setSelectedService(undefined);
    }
  };

  const openAddDialog = () => {
    setSelectedService(undefined);
    setFormOpen(true);
  };

  return (
    <>
      <div className="flex flex-col gap-8">
        <h1 className="text-3xl font-bold tracking-tight">My Services</h1>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Products & Services</CardTitle>
              <CardDescription>Manage predefined items for your invoices and quotes.</CardDescription>
            </div>
            <Button size="sm" onClick={openAddDialog}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Service
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">{service.name}</TableCell>
                    <TableCell className="text-muted-foreground">{service.description}</TableCell>
                    <TableCell className="text-right">${service.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(service)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(service)} className="text-destructive">Delete</DropdownMenuItem>
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

      <ServiceFormDialog
        open={isFormOpen}
        onOpenChange={setFormOpen}
        service={selectedService}
      />
      <DeleteConfirmationDialog
        open={isConfirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        onConfirm={confirmDelete}
        title="Are you sure you want to delete this service?"
        description="This action cannot be undone. This will permanently remove the service."
      />
    </>
  );
}
