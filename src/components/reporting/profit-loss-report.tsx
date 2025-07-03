
'use client';

import { useData } from "@/contexts/data-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

export function ProfitLossReport() {
  const { invoices, expenses } = useData();

  // For simplicity, we'll use all data. A real implementation would have a date picker.
  const totalRevenue = invoices
    .filter(inv => inv.status === 'Paid')
    .reduce((sum, inv) => sum + inv.amount, 0);
  
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const netProfit = totalRevenue - totalExpenses;

  const chartData = [
    { month: 'Jul', revenue: 1200, expenses: 600 },
    { month: 'Aug', revenue: 2100, expenses: 900 },
    { month: 'Sep', revenue: 850, expenses: 450 },
    { month: 'Oct', revenue: 2500, expenses: 750 },
    { month: 'Nov', revenue: 1800, expenses: 950 },
    { month: 'Dec', revenue: 3200, expenses: 1200 },
  ];

  const chartConfig = {
    revenue: {
      label: 'Revenue',
      color: 'hsl(var(--chart-1))',
    },
    expenses: {
      label: 'Expenses',
      color: 'hsl(var(--chart-2))',
    },
  } satisfies ChartConfig;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">From all paid invoices.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">From all recorded expenses.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${netProfit.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Revenue minus expenses.</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Monthly Overview (Last 6 Months)</h3>
        <div className="h-[350px]">
           <ChartContainer config={chartConfig} className="h-full w-full">
              <BarChart accessibilityLayer data={chartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                      dataKey="month"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                  />
                  <YAxis tickFormatter={(value) => `$${value/1000}K`} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                  <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
                  <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
              </BarChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}
