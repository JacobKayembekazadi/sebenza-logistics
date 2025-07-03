
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useData } from '@/contexts/data-context';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function StockTransfersPage() {
  const { stockTransferLogs } = useData();

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold tracking-tight">Stock Transfer History</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Audit Log</CardTitle>
          <CardDescription>A complete history of all stock movements between warehouses.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>From Warehouse</TableHead>
                <TableHead>To Warehouse</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stockTransferLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No stock transfers have been recorded yet.
                  </TableCell>
                </TableRow>
              ) : (
                stockTransferLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{log.date}</TableCell>
                    <TableCell className="font-medium">{log.itemName}</TableCell>
                    <TableCell>{log.quantity}</TableCell>
                    <TableCell>{log.fromWarehouseName}</TableCell>
                    <TableCell>{log.toWarehouseName}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
