// src/app/(dashboard)/accounting/page.jsx
"use client";

import { useEffect, useState } from "react";
import AccountingChart from "@/app/components/AccountingChart";
import {
  getLastWeekRevenue,
  getLastMonthRevenue,
  getLastYearRevenue,
} from "@/utils/billService";
import {
  getLastWeekExpense,
  getLastMonthExpense,
  getLastYearExpense,
} from "@/utils/expensesService"; // ← NEW imports

export default function Page() {
  const [period, setPeriod] = useState("last-week");
  const [income, setIncome] = useState(null);
  const [expense, setExpense] = useState(null);

  /* ─── fetch income & expense whenever selector changes ─── */
  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        const [inc, exp] =
          period === "last-week"
            ? await Promise.all([getLastWeekRevenue(), getLastWeekExpense()])
            : period === "last-month"
            ? await Promise.all([getLastMonthRevenue(), getLastMonthExpense()])
            : await Promise.all([getLastYearRevenue(), getLastYearExpense()]);

        if (alive) {
          setIncome(Number(inc));
          setExpense(Number(exp));
        }
      } catch (err) {
        console.error("Accounting fetch error:", err);
        if (alive) {
          setIncome(0);
          setExpense(0);
        }
      }
    };

    load();
    return () => {
      alive = false; // cancel setState on unmount / fast re-switch
    };
  }, [period]);

  /* while either request is still pending, fall back to 0 for math */
  const incVal = income ?? 0;
  const expVal = expense ?? 0;
  const profit = incVal - expVal;

  const rows = [
    { label: "Income Statement", value: income },
    { label: "Total Expenses", value: expense },
    { label: "Net Profit Calculation", value: profit },
  ];

  return (
    <section className="flex flex-col gap-4">
      {/* header */}
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold tracking-wide">ACCOUNTING</h1>

        <div className="flex items-center gap-4">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="rounded border border-gray-300 px-3 py-1 text-sm outline-sky-400"
          >
            <option value="last-week">Last Week</option>
            <option value="last-month">Last Month</option>
            <option value="last-year">Last Year</option>
          </select>
          {/* <button className="rounded bg-emerald-400/80 px-3 py-1 text-xs font-semibold text-white shadow">
            EXPORT
          </button> */}
        </div>
      </header>

      {/* card */}
      <div className="p-6 flex flex-col md:flex-row items-center w-full md:w-3/4 max-w-3xl mx-auto">
        {/* summary list */}
        <ul className="w-full md:w-3/4 divide-y divide-sky-300 text-sm font-medium">
          {rows.map(({ label, value }) => (
            <li key={label} className="flex justify-between py-2">
              <span>{label}</span>
              <span>
                {value == null ? "…" : `Rs ${value.toLocaleString("en-LK")}`}
              </span>
            </li>
          ))}
        </ul>

        {/* pie chart */}
        <div className="mt-2 w-full md:w-6/12 flex justify-center">
          <AccountingChart income={incVal} expenses={expVal} profit={profit} />
        </div>
      </div>
    </section>
  );
}
