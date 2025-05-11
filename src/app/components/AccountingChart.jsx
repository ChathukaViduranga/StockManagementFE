"use client";

import { PieChart, Pie, Cell } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

/* colours (sky‑shades – tweak as you like) */
const COLORS = [
  "hsl(var(--chart-1))", // Income
  "hsl(var(--chart-2))", // Expenses
  "hsl(var(--chart-3))", // Profit
];

/* data */
const data = [
  { name: "Income", value: 250_000 },
  { name: "Expenses", value: 175_000 },
  { name: "Profit", value: 75_000 },
];

/* minimal ChartConfig so ChartContainer is happy */
const chartConfig = {
  amount: { label: "Amount (Rs.)" },
  income: { label: "Income" },
  expenses: { label: "Expenses" },
  profit: { label: "Profit" },
};

export default function AccountingPieChart() {
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square w-full"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
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
