
'use client';

import { useData } from "@/contexts/data-context";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { Pie, PieChart, Cell } from "recharts";

export function ExpensesByCategoryReport() {
    const { expenses } = useData();

    const expensesByCategory = expenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
    }, {} as Record<string, number>);

    const chartData = Object.entries(expensesByCategory).map(([category, value], index) => ({
        name: category,
        value,
        fill: `hsl(var(--chart-${index + 1}))`,
    }));

    const chartConfig = chartData.reduce((acc, item) => {
        const key = item.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
        acc[key] = {
            label: item.name,
            color: item.fill
        };
        return acc;
    }, {} as ChartConfig);

    if (chartData.length === 0) {
        return (
            <div className="flex items-center justify-center h-[400px]">
                <p className="text-muted-foreground">No expense data available to display.</p>
            </div>
        )
    }

    return (
       <div className="h-[400px] w-full flex items-center justify-center">
         <ChartContainer config={chartConfig} className="h-full w-full max-w-sm">
            <PieChart>
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    strokeWidth={5}
                >
                    {chartData.map((entry) => (
                      <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                    ))}
                </Pie>
                <ChartLegend
                    content={<ChartLegendContent nameKey="name" />}
                    verticalAlign="bottom"
                    align="center"
                    className="flex-wrap"
                />
            </PieChart>
        </ChartContainer>
       </div>
    );
}
