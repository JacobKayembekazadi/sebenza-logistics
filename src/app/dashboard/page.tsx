
'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DollarSign, FileText, Banknote, AlertTriangle, Users, FilePlus, Landmark, Clock } from "lucide-react"
import { useData } from '@/contexts/data-context';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

export default function DashboardPage() {
  const { invoices, estimates, expenses } = useData();

  // Calculations
  const totalIncome = invoices
    .filter(inv => inv.status === 'Paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const totalProfits = totalIncome - totalExpenses;

  const outstandingInvoices = invoices.filter(inv => inv.status === 'Pending' || inv.status === 'Overdue');
  
  const pendingQuotes = estimates.filter(est => est.status === 'Sent' || est.status === 'Draft');
  
  const recentOutstanding = [
    ...outstandingInvoices.map(i => ({id: i.id, type: 'Invoice', client: i.client, amount: i.amount, date: i.date})),
    ...pendingQuotes.map(e => ({id: e.id, type: 'Quote', client: e.client, amount: e.amount, date: e.date})),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);


  const chartData = [
    { month: 'Jan', income: 1860, expenses: 800 },
    { month: 'Feb', income: 3050, expenses: 1200 },
    { month: 'Mar', income: 2370, expenses: 980 },
    { month: 'Apr', income: 730, expenses: 1500 },
    { month: 'May', income: 2090, expenses: 1100 },
    { month: 'Jun', income: 2140, expenses: 1300 },
  ]

  const chartConfig = {
    income: {
      label: 'Income',
      color: 'hsl(var(--chart-1))',
    },
    expenses: {
      label: 'Expenses',
      color: 'hsl(var(--chart-2))',
    },
  } satisfies ChartConfig


  return (
    <div className="flex flex-col gap-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

        {/* Main Metric Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Profits</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${totalProfits.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">Total income minus expenses</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Income</CardTitle>
                    <Banknote className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${totalIncome.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">Based on paid invoices</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Expenses</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">Total recorded expenses</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Unbilled Time</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">12h 30m</div>
                    <p className="text-xs text-muted-foreground">Placeholder data</p>
                </CardContent>
            </Card>
        </div>

        {/* Quick Actions & Chart */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-3">
                <CardHeader>
                    <CardTitle>Get things done</CardTitle>
                    <CardDescription>Quick actions to manage your business.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <Button asChild variant="outline" className="justify-start">
                        <Link href="/clients"><Users className="mr-2"/> Add Your Client</Link>
                    </Button>
                    <Button asChild variant="outline" className="justify-start">
                        <Link href="/invoices"><FilePlus className="mr-2"/> Create an Invoice & Get Paid</Link>
                    </Button>
                    <Button asChild variant="outline" className="justify-start">
                        <Link href="/estimates"><FileText className="mr-2"/> Secure a new deal (Quote)</Link>
                    </Button>
                    <Button asChild variant="outline" className="justify-start">
                        <Link href="/expenses"><Landmark className="mr-2"/> Track your spending</Link>
                    </Button>
                    <Button variant="outline" className="justify-start">
                        <Landmark className="mr-2"/> Connect My Bank Account
                    </Button>
                    <Button variant="outline" className="justify-start">
                        <DollarSign className="mr-2"/> Setup Payment Gateway
                    </Button>
                </CardContent>
            </Card>
            <Card className="lg:col-span-4">
                <CardHeader>
                    <CardTitle>Income & Expenses</CardTitle>
                    <CardDescription>Last 6 months</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                    <ChartContainer config={chartConfig} className="h-[300px] w-full">
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
                            <Bar dataKey="income" fill="var(--color-income)" radius={4} />
                            <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>

        {/* Outstanding Invoices & Quotes */}
        <Card>
            <CardHeader>
                <CardTitle>Outstanding Invoices & Quotes</CardTitle>
                <CardDescription>
                    You have {outstandingInvoices.length} outstanding invoices and {pendingQuotes.length} pending quotes.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>Client</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recentOutstanding.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    All caught up! No outstanding items.
                                </TableCell>
                            </TableRow>
                        )}
                        {recentOutstanding.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>
                                <Badge variant={item.type === 'Invoice' ? 'destructive' : 'default'} className="capitalize">{item.type}</Badge>
                                </TableCell>
                                <TableCell className="font-medium">{item.client}</TableCell>
                                <TableCell>{item.date}</TableCell>
                                <TableCell className="text-right">${item.amount.toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  )
}
