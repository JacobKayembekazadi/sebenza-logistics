
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfitLossStatement } from "@/components/accounting/profit-loss-statement";
import { BalanceSheetReport } from "@/components/accounting/balance-sheet-report";
import { SalesTaxReport } from "@/components/accounting/sales-tax-report";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

function PlaceholderReport({ title }: { title: string }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                 <CardDescription>
                    This report is not yet available.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">Coming Soon</p>
                </div>
            </CardContent>
        </Card>
    );
}


export default function AccountingPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Financial Reports</h1>
        <Button variant="outline" onClick={() => window.print()}>
            <Download className="mr-2 h-4 w-4" />
            Export Reports
        </Button>
      </div>

      <Tabs defaultValue="profit-loss" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-6">
          <TabsTrigger value="profit-loss">Profit & Loss</TabsTrigger>
          <TabsTrigger value="balance-sheet">Balance Sheet</TabsTrigger>
          <TabsTrigger value="sales-tax">Sales Tax</TabsTrigger>
          <TabsTrigger value="general-ledger">General Ledger</TabsTrigger>
          <TabsTrigger value="cash-flow">Cash Flow</TabsTrigger>
          <TabsTrigger value="trial-balance">Trial Balance</TabsTrigger>
        </TabsList>
        <TabsContent value="profit-loss" className="mt-4">
          <ProfitLossStatement />
        </TabsContent>
        <TabsContent value="balance-sheet" className="mt-4">
          <BalanceSheetReport />
        </TabsContent>
        <TabsContent value="sales-tax" className="mt-4">
            <SalesTaxReport />
        </TabsContent>
        <TabsContent value="general-ledger" className="mt-4">
            <PlaceholderReport title="General Ledger" />
        </TabsContent>
        <TabsContent value="cash-flow" className="mt-4">
            <PlaceholderReport title="Cash Flow Statement" />
        </TabsContent>
        <TabsContent value="trial-balance" className="mt-4">
            <PlaceholderReport title="Trial Balance" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
