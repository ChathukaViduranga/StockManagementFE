// src/app/(dashboard)/accounting/page.jsx
"use client";

import { useEffect, useState } from "react";
import AccountingChart from "@/app/components/AccountingChart";
import ItemBill from "@/app/components/ItemBill";
import RepairBills from "@/app/components/RepairBills";
import {
  getLastWeekRevenue,
  getLastMonthRevenue,
  getLastYearRevenue,
} from "@/utils/billService";
import {
  getLastWeekExpense,
  getLastMonthExpense,
  getLastYearExpense,
} from "@/utils/expensesService";
import { useAuth } from "../../providers";
import { useRouter } from "next/navigation";
import IncomeCard from "@/app/components/IncomeCard";

export default function Page() {
  const { role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (role !== "admin") router.replace("/items");
  }, [role, router]);
  if (role !== "admin") return null;

  const [period, setPeriod] = useState("last-week");
  const [table, setTable] = useState("ITEM"); //  ITEM | REPAIR
  const [income, setIncome] = useState(null);
  const [expense, setExpense] = useState(null);

  /* fetch income & expense whenever selector changes */
  useEffect(() => {
    let alive = true;
    (async () => {
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
      } catch {
        if (alive) {
          setIncome(0);
          setExpense(0);
        }
      }
    })();
    return () => {
      alive = false;
    };
  }, [period]);

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
        </div>
      </header>
      {/* summary card */}
      <div className="p-6 flex flex-col md:flex-row items-center w-full md:w-3/4 max-w-3xl mx-auto">
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
        <div className="mt-2 w-full md:w-6/12 flex justify-center">
          <AccountingChart income={incVal} expenses={expVal} profit={profit} />
        </div>
      </div>
      {/* profit cards (re-usable component) */}
      <div className="flex flex-col md:flex-row gap-4 w-full md:w-3/4 max-w-3xl mx-auto">
        <IncomeCard type="ITEM" period={period} />
        <IncomeCard type="REPAIR" period={period} />
      </div>
      {/* table-type toggle */}
      <div className="flex gap-2 self-end">
        {["ITEM", "REPAIR"].map((t) => (
          <button
            key={t}
            onClick={() => setTable(t)}
            className={`rounded-full px-4 py-1 text-sm font-semibold ${
              table === t ? "bg-sky-600 text-white" : "bg-sky-100 text-sky-700"
            }`}
          >
            {t === "ITEM" ? "Item Income" : "Repair Income"}
          </button>
        ))}
      </div>
      {/* conditional table */}
      {table === "ITEM" ? (
        <ItemBill period={period} />
      ) : (
        <RepairBills period={period} />
      )}
    </section>
  );
}
