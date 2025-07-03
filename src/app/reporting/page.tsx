
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfitLossReport } from "@/components/reporting/profit-loss-report";
import { SalesByClientReport } from "@/components/reporting/sales-by-client-report";
import { ExpensesByCategoryReport } from "@/components/reporting/expenses-by-category-report";

export default function ReportingPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold tracking-tight">Reporting</h1>

      <Tabs defaultValue="profit-loss" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3">
          <TabsTrigger value="profit-loss">Profit & Loss</TabsTrigger>
          <TabsTrigger value="sales-by-client">Sales by Client</TabsTrigger>
          <TabsTrigger value="expenses-by-category">Expenses</TabsTrigger>
        </TabsList>
        <TabsContent value="profit-loss" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Profit & Loss Report</CardTitle>
              <CardDescription>
                An overview of your revenue, expenses, and profitability over a selected period.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfitLossReport />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="sales-by-client" className="mt-4">
           <Card>
            <CardHeader>
              <CardTitle>Sales by Client</CardTitle>
              <CardDescription>
                A breakdown of your total sales attributed to each client.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SalesByClientReport />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="expenses-by-category" className="mt-4">
           <Card>
            <CardHeader>
              <CardTitle>Expenses by Category</CardTitle>
              <CardDescription>
                A visual breakdown of your spending across different categories.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ExpensesByCategoryReport />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
