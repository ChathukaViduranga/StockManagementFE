"use client";

import { useEffect, useState, useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { getDailyRevenue } from "@/utils/billService";

/* brand colour from your mock-up */
const navy = "#003A70";

/* helper to get 7-day labels oldest→newest */
function buildLabels() {
  const days = ["S", "M", "T", "W", "T", "F", "S"]; // first letters
  const today = new Date(); // local TZ (Asia/Colombo)
  const labels = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    labels.push(days[d.getDay()]);
  }
  return labels; // length 7
}

export default function DailySalesChart() {
  const [revenue, setRevenue] = useState([]); // number[]
  const [loading, setLoading] = useState(true);

  /* fetch once on mount */
  useEffect(() => {
    const fetch = async () => {
      try {
        const arr = await getDailyRevenue(); // [0,0,0,0,0,5200,198300]
        setRevenue(arr);
      } catch (err) {
        console.error("Failed to load revenue:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  /* merge labels + values for Recharts */
  const chartData = useMemo(() => {
    const labels = buildLabels(); // 7 labels
    return labels.map((day, i) => ({
      day,
      amt: revenue[i] ?? 0,
    }));
  }, [revenue]);

  /* dynamic Y-axis ticks (multiple of 4 up to max) */
  const yTicks = useMemo(() => {
    const max = Math.max(...chartData.map((d) => d.amt), 0);
    const step = Math.ceil(max / 4 / 100) * 100 || 200; // nice round step
    return Array.from({ length: 5 }, (_, i) => i * step);
  }, [chartData]);

  /* config is just to satisfy <ChartContainer> */
  const config = { amt: { label: "Revenue" } };

  return (
    <ChartContainer config={config} className="w-full h-72">
      {loading ? (
        <div className="flex h-full items-center justify-center text-sm">
          Loading…
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 10, bottom: 18 }}
          >
            <CartesianGrid stroke="#e5e7eb" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              ticks={yTicks}
              domain={[0, yTicks[yTicks.length - 1]]}
              tickFormatter={(v) => `Rs ${v.toLocaleString("en-LK")}`}
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent prefix="Rs " />}
            />

            <Line
              type="linear"
              dataKey="amt"
              stroke={navy}
              strokeWidth={3}
              dot={{ r: 5, fill: navy, stroke: navy }}
              activeDot={{ r: 7, fill: navy, stroke: navy }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </ChartContainer>
  );
}
