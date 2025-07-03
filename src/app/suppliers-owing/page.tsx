
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useData } from '@/contexts/data-context';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function SuppliersOwingPage() {
  const { purchaseOrders } = useData();

  const outstandingPOs = purchaseOrders.filter(
    po => po.status === 'Sent' || po.status === 'Fulfilled'
  );

  const suppliersOwing = outstandingPOs.reduce((acc, po) => {
    if (!acc[po.supplierName]) {
      acc[po.supplierName] = { totalAmount: 0, poCount: 0 };
    }
    acc[po.supplierName].totalAmount += po.amount;
    acc[po.supplierName].poCount += 1;
    return acc;
  }, {} as Record<string, { totalAmount: number; poCount: number }>);

  const sortedSuppliers = Object.entries(suppliersOwing).sort(([, a], [, b]) => b.totalAmount - a.totalAmount);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold tracking-tight">Suppliers Owing Board</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Outstanding Payments to Suppliers</CardTitle>
          <CardDescription>
            A summary of all outstanding purchase orders that are awaiting payment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supplier</TableHead>
                <TableHead>Outstanding POs</TableHead>
                <TableHead className="text-right">Total Amount Owed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedSuppliers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    No outstanding payments to suppliers.
                  </TableCell>
                </TableRow>
              ) : (
                sortedSuppliers.map(([supplierName, data]) => (
                  <TableRow key={supplierName}>
                    <TableCell className="font-medium">{supplierName}</TableCell>
                    <TableCell>{data.poCount}</TableCell>
                    <TableCell className="text-right font-mono">${data.totalAmount.toFixed(2)}</TableCell>
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
