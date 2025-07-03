
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusCircle, Repeat, ScrollText } from 'lucide-react';
import { useData } from '@/contexts/data-context';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import type { StockItem } from '@/lib/data';
import { DeleteConfirmationDialog } from '@/components/common/delete-confirmation-dialog';
import { InventoryFormDialog } from '@/components/inventory/inventory-form-dialog';
import { Badge } from '@/components/ui/badge';
import { TransferStockDialog } from '@/components/inventory/transfer-stock-dialog';
import Link from 'next/link';

export default function InventoryPage() {
  const { stockItems, deleteStockItem } = useData();
  const [isFormOpen, setFormOpen] = useState(false);
  const [isConfirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [isTransferOpen, setTransferOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StockItem | undefined>(undefined);

  const handleEdit = (item: StockItem) => {
    setSelectedItem(item);
    setFormOpen(true);
  };

  const handleDelete = (item: StockItem) => {
    setSelectedItem(item);
    setConfirmDeleteOpen(true);
  };

  const handleTransfer = (item: StockItem) => {
    setSelectedItem(item);
    setTransferOpen(true);
  }

  const confirmDelete = () => {
    if (selectedItem) {
      deleteStockItem(selectedItem.id);
      setConfirmDeleteOpen(false);
      setSelectedItem(undefined);
    }
  };

  const openAddDialog = () => {
    setSelectedItem(undefined);
    setFormOpen(true);
  };
  
  const statusVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
    'In Warehouse': 'default',
    'In Transit': 'secondary',
    'Delivered': 'outline',
  };

  const statusStyle : { [key: string]: string } = {
    'Delivered': 'bg-accent text-accent-foreground',
  }

  return (
    <>
      <div className="flex flex-col gap-8">
        <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Stock Items</CardTitle>
              <CardDescription>Track all incoming and outgoing stock consignments.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" asChild>
                <Link href="/stock-transfers">
                  <ScrollText className="mr-2 h-4 w-4" />
                  Transfer History
                </Link>
              </Button>
              <Button size="sm" onClick={openAddDialog}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Stock Item
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Warehouse</TableHead>
                  <TableHead>Sender</TableHead>
                  <TableHead>Receiver</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stockItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.reference}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.warehouseName || 'N/A'}</TableCell>
                    <TableCell>{item.senderName}</TableCell>
                    <TableCell>{item.receiverName}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[item.status]} className={statusStyle[item.status]}>
                        {item.status}
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
                          <DropdownMenuItem onClick={() => handleEdit(item)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleTransfer(item)}>
                            <Repeat className="mr-2 h-4 w-4" />
                            Transfer Stock
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDelete(item)} className="text-destructive">Delete</DropdownMenuItem>
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

      <InventoryFormDialog
        open={isFormOpen}
        onOpenChange={setFormOpen}
        item={selectedItem}
      />
      <TransferStockDialog
        open={isTransferOpen}
        onOpenChange={setTransferOpen}
        item={selectedItem}
      />
      <DeleteConfirmationDialog
        open={isConfirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        onConfirm={confirmDelete}
        title="Are you sure you want to delete this stock item?"
        description="This action cannot be undone. This will permanently remove the stock record."
      />
    </>
  );
}
