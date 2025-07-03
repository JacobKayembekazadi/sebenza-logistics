
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusCircle, Printer } from 'lucide-react';
import { useData } from '@/contexts/data-context';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { MoneyTransfer } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { DeleteConfirmationDialog } from '@/components/common/delete-confirmation-dialog';
import { MoneyTransferFormDialog } from '@/components/money-transfers/money-transfer-form-dialog';

export default function MoneyTransfersPage() {
  const { moneyTransfers, deleteMoneyTransfer } = useData();
  const [isFormOpen, setFormOpen] = useState(false);
  const [isConfirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState<MoneyTransfer | undefined>(undefined);

  const handleEdit = (transfer: MoneyTransfer) => {
    setSelectedTransfer(transfer);
    setFormOpen(true);
  };

  const handleDelete = (transfer: MoneyTransfer) => {
    setSelectedTransfer(transfer);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedTransfer) {
      deleteMoneyTransfer(selectedTransfer.id);
      setConfirmDeleteOpen(false);
      setSelectedTransfer(undefined);
    }
  };

  const openAddDialog = () => {
    setSelectedTransfer(undefined);
    setFormOpen(true);
  };
  
  const statusVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
    'Pending Collection': 'secondary',
    'Collected': 'outline',
  };

  const statusStyle: { [key:string]: string } = {
    'Collected': 'bg-accent text-accent-foreground',
  }

  return (
    <>
      <div className="flex flex-col gap-8">
        <h1 className="text-3xl font-bold tracking-tight">Money Transfers</h1>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Transfer Ledger</CardTitle>
              <CardDescription>Log and track all money transfer transactions.</CardDescription>
            </div>
            <Button size="sm" onClick={openAddDialog}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Log Transfer
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ref Code</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Sender</TableHead>
                  <TableHead>Receiver</TableHead>
                  <TableHead>To Collect</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {moneyTransfers.map((transfer) => (
                  <TableRow key={transfer.id}>
                    <TableCell className="font-medium">{transfer.referenceCode}</TableCell>
                    <TableCell>{transfer.date}</TableCell>
                    <TableCell>
                      <div>
                        <p>{transfer.senderName}</p>
                        <p className="text-sm text-muted-foreground">{transfer.fromLocation}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                       <div>
                        <p>{transfer.receiverName}</p>
                        <p className="text-sm text-muted-foreground">{transfer.toLocation}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">${transfer.amountToCollect.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[transfer.status]} className={statusStyle[transfer.status]}>
                        {transfer.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(transfer)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => window.print()}>
                            <Printer className="mr-2 h-4 w-4" />
                            Print Receipt
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(transfer)} className="text-destructive">Delete</DropdownMenuItem>
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

      <MoneyTransferFormDialog
        open={isFormOpen}
        onOpenChange={setFormOpen}
        transfer={selectedTransfer}
      />
      <DeleteConfirmationDialog
        open={isConfirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        onConfirm={confirmDelete}
        title="Are you sure you want to delete this transfer?"
        description="This action cannot be undone. This will permanently remove the transaction record."
      />
    </>
  );
}
