
'use client';

import { useData } from "@/contexts/data-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow, TableFooter } from "@/components/ui/table";
import { useEffect, useState } from "react";

export function BalanceSheetReport() {
    const { assets, purchaseOrders, invoices } = useData();
    const [reportDate, setReportDate] = useState('');

    useEffect(() => {
      setReportDate(new Date().toLocaleDateString());
    }, []);
    
    // Assets
    const accountsReceivable = invoices
        .filter(inv => inv.status === 'Pending' || inv.status === 'Partial')
        .reduce((sum, inv) => {
            const totalAmount = inv.amount + (inv.tax || 0) - (inv.discount || 0) + (inv.lateFee || 0);
            const balanceDue = totalAmount - (inv.paidAmount || 0);
            return sum + balanceDue;
        }, 0);
    const fixedAssets = assets.reduce((sum, asset) => sum + asset.value, 0);
    const totalAssets = accountsReceivable + fixedAssets;

    // Liabilities
    const accountsPayable = purchaseOrders
        .filter(po => po.status === 'Sent' || po.status === 'Fulfilled')
        .reduce((sum, po) => sum + po.amount, 0);
    const totalLiabilities = accountsPayable;

    // Equity
    const totalEquity = totalAssets - totalLiabilities;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Balance Sheet</CardTitle>
                <CardDescription>
                    As of {reportDate}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-center">Assets</h3>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Accounts Receivable</TableCell>
                                    <TableCell className="text-right">${accountsReceivable.toFixed(2)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Fixed Assets</TableCell>
                                    <TableCell className="text-right">${fixedAssets.toFixed(2)}</TableCell>
                                </TableRow>
                            </TableBody>
                            <TableFooter>
                                <TableRow className="font-bold text-base bg-muted/50">
                                    <TableCell>Total Assets</TableCell>
                                    <TableCell className="text-right">${totalAssets.toFixed(2)}</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-center">Liabilities & Equity</h3>
                        <Table>
                            <TableBody>
                                <TableRow className="font-semibold">
                                    <TableCell>Liabilities</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="pl-8">Accounts Payable</TableCell>
                                    <TableCell className="text-right">${accountsPayable.toFixed(2)}</TableCell>
                                </TableRow>
                                 <TableRow className="font-bold">
                                    <TableCell>Total Liabilities</TableCell>
                                    <TableCell className="text-right">${totalLiabilities.toFixed(2)}</TableCell>
                                </TableRow>
                                <TableRow className="font-semibold pt-4">
                                    <TableCell>Equity</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                                 <TableRow>
                                    <TableCell className="pl-8">Owner's Equity</TableCell>
                                    <TableCell className="text-right">${totalEquity.toFixed(2)}</TableCell>
                                </TableRow>
                                 <TableRow className="font-bold">
                                    <TableCell>Total Equity</TableCell>
                                    <TableCell className="text-right">${totalEquity.toFixed(2)}</TableCell>
                                </TableRow>
                            </TableBody>
                             <TableFooter>
                                <TableRow className="font-bold text-base bg-muted/50">
                                    <TableCell>Total Liabilities & Equity</TableCell>
                                    <TableCell className="text-right">${(totalLiabilities + totalEquity).toFixed(2)}</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
