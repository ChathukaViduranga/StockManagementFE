"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Dot,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

/* --- data (Rs) --- */
const data = [
  { day: "S", amt: 0 },
  { day: "M", amt: 220 },
  { day: "T", amt: 300 },
  { day: "W", amt: 650 },
  { day: "T", amt: 580 },
];

/* --- ChartConfig just to satisfy ChartContainer --- */
const config = { amt: { label: "Sales" } };

/* --- brand colour straight from your mock‑up --- */
const navy = "#003A70"; // dark navy blue

export default function DailySalesChart() {
  return (
    <ChartContainer config={config} className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 10, left: 10, bottom: 18 }}
        >
          {/* horizontal grid lines only */}
          <CartesianGrid stroke="#e5e7eb" vertical={false} />

          <XAxis
            dataKey="day"
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => `Rs ${v}`}
            ticks={[0, 200, 400, 600, 800]}
            domain={[0, 800]}
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />

          {/* tooltip with Rs prefix */}
          <Tooltip
            cursor={false}
            content={<ChartTooltipContent prefix="Rs " />}
          />

          <Line
            type="linear" /* ← STRAIGHT segments */
            dataKey="amt"
            stroke={navy}
            strokeWidth={3}
            dot={{ r: 5, fill: navy, stroke: navy }}
            activeDot={{ r: 7, fill: navy, stroke: navy }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
