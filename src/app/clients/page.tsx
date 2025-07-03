'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusCircle, Upload, Download } from 'lucide-react';
import { useData } from '@/contexts/data-context';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { Client } from '@/lib/data';
import { DeleteConfirmationDialog } from '@/components/common/delete-confirmation-dialog';
import { ClientFormDialog } from '@/components/clients/client-form-dialog';

export default function ClientsPage() {
  const { clients, deleteClient } = useData();
  const [isFormOpen, setFormOpen] = useState(false);
  const [isConfirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | undefined>(undefined);

  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    setFormOpen(true);
  };

  const handleDelete = (client: Client) => {
    setSelectedClient(client);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedClient) {
      deleteClient(selectedClient.id);
      setConfirmDeleteOpen(false);
      setSelectedClient(undefined);
    }
  };

  const openAddDialog = () => {
    setSelectedClient(undefined);
    setFormOpen(true);
  };

  return (
    <>
      <div className="flex flex-col gap-8">
        <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>All Clients</CardTitle>
              <CardDescription>Manage your client information.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Import Clients
              </Button>
              <Button size="sm" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Clients
              </Button>
              <Button size="sm" onClick={openAddDialog}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Client
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={client.avatar} data-ai-hint="person" />
                          <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <p className="font-medium">{client.name}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p>{client.email}</p>
                        <p className="text-sm text-muted-foreground">{client.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>{client.address}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(client)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(client)} className="text-destructive">Delete</DropdownMenuItem>
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

      <ClientFormDialog
        open={isFormOpen}
        onOpenChange={setFormOpen}
        client={selectedClient}
      />
      <DeleteConfirmationDialog
        open={isConfirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        onConfirm={confirmDelete}
        title="Are you sure you want to delete this client?"
        description="This action cannot be undone. This will permanently remove the client's information."
      />
    </>
  );
}
