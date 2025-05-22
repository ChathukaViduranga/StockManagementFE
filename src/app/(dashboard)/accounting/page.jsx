"use client";

import AccountingChart from "@/app/components/AccountingChart";
import { useState } from "react";
import { metadata } from "./metadata";

function page() {
  const [timePeriod, setTimePeriod] = useState("last-week");

  const rows = [
    { label: "Income Statement", value: 250000 },
    { label: "Total Expenses", value: 175000 },
    { label: "Net Profit Calculation", value: 75000 },
  ];

  return (
    <section className="flex flex-col gap-4">
      {/* HEADER */}
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold tracking-wide">ACCOUNTING</h1>
        <div className="flex items-center gap-4">
          <select
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
            className="rounded border border-gray-300 px-3 py-1 text-sm outline-sky-400"
          >
            <option value="last-week">Last Week</option>
            <option value="last-month">Last Month</option>
            <option value="last-year">Last Year</option>
          </select>
          <button
            className="rounded bg-emerald-400/80 px-3 py-1 text-xs font-semibold text-white
                           shadow hover:bg-emerald-500 active:translate-y-px"
          >
            EXPORT
          </button>
        </div>
      </header>

      {/* CARD */}
      <div className="p-6 flex flex-col md:flex-row items-center w-full md:w-3/4 max-w-3xl mx-auto">
        {/* summary list */}
        <ul className="w-full md:w-3/4 divide-y divide-sky-300 text-sm font-medium">
          {rows.map(({ label, value }) => (
            <li key={label} className="flex justify-between py-2">
              <span>{label}</span>
              <span>Rs.&nbsp;{value.toLocaleString("en-LK")}</span>
            </li>
          ))}
        </ul>

        {/* pie chart */}
        <div className="mt-2 w-full md:w-6/12 flex justify-center">
          <AccountingChart />
        </div>
      </div>
    </section>
  );
}

export default page;
