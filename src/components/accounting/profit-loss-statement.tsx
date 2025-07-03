
'use client';

import { useData } from "@/contexts/data-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";

export function ProfitLossStatement() {
  const { invoices, expenses } = useData();

  const totalRevenue = invoices
    .filter(inv => inv.status === 'Paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const expensesByCategory = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);
  
  const totalExpenses = Object.values(expensesByCategory).reduce((sum, amount) => sum + amount, 0);

  const netProfit = totalRevenue - totalExpenses;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profit & Loss Statement</CardTitle>
        <CardDescription>
          For the period ending {new Date().toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="font-bold bg-muted/50">
              <TableCell>Revenue</TableCell>
              <TableCell></TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="pl-8">Total Sales</TableCell>
              <TableCell className="text-right">${totalRevenue.toFixed(2)}</TableCell>
            </TableRow>
             <TableRow className="font-bold">
              <TableCell>Total Revenue</TableCell>
              <TableCell className="text-right">${totalRevenue.toFixed(2)}</TableCell>
            </TableRow>

            <TableRow className="font-bold bg-muted/50">
              <TableCell>Expenses</TableCell>
              <TableCell></TableCell>
            </TableRow>
            {Object.entries(expensesByCategory).map(([category, amount]) => (
                <TableRow key={category}>
                    <TableCell className="pl-8">{category}</TableCell>
                    <TableCell className="text-right">${amount.toFixed(2)}</TableCell>
                </TableRow>
            ))}
             <TableRow className="font-bold">
              <TableCell>Total Expenses</TableCell>
              <TableCell className="text-right">${totalExpenses.toFixed(2)}</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
             <TableRow className="text-lg font-bold bg-accent/50">
                <TableCell>Net Profit</TableCell>
                <TableCell className="text-right">${netProfit.toFixed(2)}</TableCell>
             </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  );
}
