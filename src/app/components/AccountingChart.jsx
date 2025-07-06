"use client";

import { PieChart, Pie, Cell } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

/* colours (sky shades – tweak as needed) */
const COLORS = [
  "hsl(var(--chart-1))", // Income
  "hsl(var(--chart-2))", // Expenses
  "hsl(var(--chart-3))", // Profit
];

/* minimal ChartConfig so ChartContainer is happy */
const chartConfig = {
  amount: { label: "Amount (Rs.)" },
  income: { label: "Income" },
  expenses: { label: "Expenses" },
  profit: { label: "Profit" },
};

export default function AccountingChart({ income, expenses, profit }) {
  const data = [
    { name: "Income", value: income },
    { name: "Expenses", value: expenses },
    { name: "Profit", value: profit },
  ];

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square w-full"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel prefix="Rs " />}
        />
        <Pie
          data={data}
          dataKey="value"
          innerRadius={12}
          paddingAngle={2}
          stroke="none"
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
