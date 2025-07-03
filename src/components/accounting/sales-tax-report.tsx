
'use client';

import { useData } from "@/contexts/data-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";

export function SalesTaxReport() {
    const { invoices } = useData();

    const invoicesWithTax = invoices.filter(inv => inv.tax && inv.tax > 0);
    const totalTaxCollected = invoicesWithTax.reduce((sum, inv) => sum + (inv.tax || 0), 0);
    const totalTaxableAmount = invoicesWithTax.reduce((sum, inv) => sum + inv.amount, 0);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Sales Tax Summary</CardTitle>
                <CardDescription>
                    A summary of sales tax collected on invoices.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Invoice ID</TableHead>
                            <TableHead>Client</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Taxable Amount</TableHead>
                            <TableHead className="text-right">Tax Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoicesWithTax.map(invoice => (
                            <TableRow key={invoice.id}>
                                <TableCell>{invoice.id}</TableCell>
                                <TableCell>{invoice.client}</TableCell>
                                <TableCell>{invoice.date}</TableCell>
                                <TableCell className="text-right">${invoice.amount.toFixed(2)}</TableCell>
                                <TableCell className="text-right">${(invoice.tax || 0).toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow className="font-bold text-base bg-muted/50">
                            <TableCell colSpan={3}>Total</TableCell>
                            <TableCell className="text-right">${totalTaxableAmount.toFixed(2)}</TableCell>
                            <TableCell className="text-right">${totalTaxCollected.toFixed(2)}</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </CardContent>
        </Card>
    );
}
