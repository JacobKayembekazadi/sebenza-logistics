
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useData } from '@/contexts/data-context';
import { Badge } from '@/components/ui/badge';
import { Upload, CheckCircle, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

// Mocked bank statement data
const mockBankTransactions = [
    { id: 'bt-1', date: '2024-11-01', description: 'Deposit from Apex Logistics', amount: 2000.00, type: 'credit' },
    { id: 'bt-2', date: '2024-10-20', description: 'Staples', amount: -75.50, type: 'debit' },
    { id: 'bt-3', date: '2024-10-20', description: 'Online Pmt, Nexus Corp', amount: 2650.00, type: 'credit' },
    { id: 'bt-4', date: '2024-10-15', description: 'ACH Transfer #12345', amount: 850.00, type: 'credit' },
    { id: 'bt-5', date: '2024-10-05', description: 'Monthly Software Fee', amount: -200.00, type: 'debit' },
    { id: 'bt-6', date: '2024-10-02', description: 'Unknown Withdrawal', amount: -150.00, type: 'debit' },
];

type BankTransaction = typeof mockBankTransactions[0];
type SystemTransaction = ReturnType<typeof useMemo<any>>[0];


export default function ReconciliationPage() {
    const { invoices, expenses } = useData();
    const { toast } = useToast();
    const [selectedBankTx, setSelectedBankTx] = useState<BankTransaction | null>(null);
    const [reconciledItems, setReconciledItems] = useState<Record<string, string>>({'bt-3': 'INV-001'}); // { bankTxId: systemTxId }

    const systemTransactions = useMemo(() => {
        const invoiceTxs = invoices
            .filter(inv => inv.paidAmount && inv.paidAmount > 0)
            .map(inv => ({
                id: inv.id,
                date: inv.date, // This should ideally be payment date
                description: `Invoice ${inv.id} - ${inv.client}`,
                amount: inv.paidAmount || 0,
                type: 'credit' as const
            }));

        const expenseTxs = expenses.map(exp => ({
            id: exp.id,
            date: exp.date,
            description: exp.description,
            amount: exp.amount,
            type: 'debit' as const
        }));

        return [...invoiceTxs, ...expenseTxs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [invoices, expenses]);
    
    const unMatch = (bankTxId: string) => {
        const newReconciledItems = { ...reconciledItems };
        delete newReconciledItems[bankTxId];
        setReconciledItems(newReconciledItems);
        if (selectedBankTx?.id === bankTxId) {
            setSelectedBankTx(null);
        }
        toast({ title: 'Match Removed', description: 'The transaction has been un-matched.' });
    };

    const handleSelectBankTx = (tx: BankTransaction) => {
        if (reconciledItems[tx.id]) {
            unMatch(tx.id);
        } else if (selectedBankTx?.id === tx.id) {
            setSelectedBankTx(null); // Deselect if clicked again
        }
        else {
            setSelectedBankTx(tx);
        }
    };
    
     const handleMatch = (systemTxId: string) => {
        if (selectedBankTx) {
            setReconciledItems(prev => ({
                ...prev,
                [selectedBankTx.id]: systemTxId,
            }));
            setSelectedBankTx(null);
            toast({
                title: 'Transaction Matched',
                description: 'The transactions have been successfully reconciled.',
            })
        }
    };

    const handleSystemTxClick = (systemTx: SystemTransaction) => {
        const isReconciled = Object.values(reconciledItems).includes(systemTx.id);

        if (isReconciled) {
            const bankTxId = Object.keys(reconciledItems).find(key => reconciledItems[key] === systemTx.id);
            if (bankTxId) {
                unMatch(bankTxId);
            }
        } else if (selectedBankTx) {
            handleMatch(systemTx.id);
        }
    };

    const isMatch = (bankTx: BankTransaction, systemTx: SystemTransaction) => {
        if (!bankTx) return false;
        const amountMatch = bankTx.type === 'credit' ? bankTx.amount === systemTx.amount : bankTx.amount === -systemTx.amount;
        return amountMatch;
    };

    return (
        <div className="flex flex-col gap-8 h-full">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Bank Reconciliation</h1>
                    <p className="text-muted-foreground">Match bank transactions to your invoices and expenses.</p>
                </div>
                <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Import Statement
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow min-h-0">
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle>Bank Transactions</CardTitle>
                        <CardDescription>Transactions from your imported statement.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow min-h-0 overflow-y-auto">
                        <ScrollArea className="h-full">
                             <Table>
                                <TableHeader className="sticky top-0 bg-card z-10">
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mockBankTransactions.map(tx => {
                                        const isReconciled = !!reconciledItems[tx.id];
                                        return (
                                            <TableRow 
                                                key={tx.id} 
                                                onClick={() => handleSelectBankTx(tx)}
                                                className={cn(
                                                    "cursor-pointer",
                                                    selectedBankTx?.id === tx.id && "bg-accent",
                                                    isReconciled && "bg-green-100/50 text-muted-foreground hover:bg-green-200/50"
                                                )}
                                            >
                                                <TableCell>{tx.date}</TableCell>
                                                <TableCell>{tx.description}</TableCell>
                                                <TableCell className={cn(
                                                    "text-right font-medium",
                                                    tx.type === 'credit' ? 'text-green-600' : 'text-destructive'
                                                )}>
                                                    {tx.amount > 0 ? '+' : ''}${tx.amount.toFixed(2)}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </ScrollArea>
                    </CardContent>
                </Card>

                 <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle>System Transactions</CardTitle>
                        <CardDescription>{selectedBankTx ? `Select a match for $${selectedBankTx.amount.toFixed(2)}` : 'Select a bank transaction to start matching.'}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow min-h-0 overflow-y-auto">
                        <ScrollArea className="h-full">
                             <Table>
                                <TableHeader className="sticky top-0 bg-card z-10">
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {systemTransactions.map(tx => {
                                        const isReconciled = Object.values(reconciledItems).includes(tx.id);
                                        const potentialMatch = selectedBankTx && !reconciledItems[selectedBankTx.id] && isMatch(selectedBankTx, tx);
                                        
                                        return (
                                            <TableRow 
                                                key={tx.id}
                                                onClick={() => handleSystemTxClick(tx)}
                                                className={cn(
                                                    (selectedBankTx || isReconciled) && "cursor-pointer",
                                                    potentialMatch && "bg-blue-100/50 dark:bg-blue-900/30",
                                                    isReconciled && "bg-green-100/50 text-muted-foreground hover:bg-green-200/50"
                                                )}
                                            >
                                                <TableCell>{tx.date}</TableCell>
                                                <TableCell>{tx.description}</TableCell>
                                                <TableCell>
                                                    {isReconciled ? (
                                                        <Badge variant="outline" className="bg-green-200/60 text-green-800"><CheckCircle className="mr-1 h-3 w-3"/>Reconciled</Badge>
                                                    ) : potentialMatch ? (
                                                         <Badge variant="default" className="bg-blue-500 hover:bg-blue-600"><HelpCircle className="mr-1 h-3 w-3"/>Potential</Badge>
                                                    ) : (
                                                        <Badge variant="secondary">Unmatched</Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className={cn(
                                                    "text-right font-medium",
                                                     tx.type === 'credit' ? 'text-green-600' : 'text-destructive'
                                                )}>
                                                     ${Math.abs(tx.amount).toFixed(2)}
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
