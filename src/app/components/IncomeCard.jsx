"use client";

import { useEffect, useState } from "react";
import {
  /* item-profits */
  getLastWeekItemProfit,
  getLastMonthItemProfit,
  getLastYearItemProfit,
  /* repair-profits */
  getLastWeekRepairProfit,
  getLastMonthRepairProfit,
  getLastYearRepairProfit,
} from "@/utils/billService";

/**
 * Re-usable summary card for either **Item** or **Repair** bill totals.
 *
 * Props
 * ─────────────────────────────────────────
 * type   → "ITEM" | "REPAIR"
 * period → "last-week" | "last-month" | "last-year"
 */
export default function IncomeCard({ type, period }) {
  const [total, setTotal] = useState(null);

  /* ─── choose correct fetcher ─── */
  useEffect(() => {
    let alive = true;

    const pick = {
      ITEM: {
        "last-week": getLastWeekItemProfit,
        "last-month": getLastMonthItemProfit,
        "last-year": getLastYearItemProfit,
      },
      REPAIR: {
        "last-week": getLastWeekRepairProfit,
        "last-month": getLastMonthRepairProfit,
        "last-year": getLastYearRepairProfit,
      },
    };

    (async () => {
      try {
        const val = await pick[type][period]();
        if (alive) setTotal(val);
      } catch {
        if (alive) setTotal(0);
      }
    })();

    return () => {
      alive = false;
    };
  }, [type, period]);

  /* card UI */
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-sky-200 bg-white p-4 shadow-sm w-full md:w-1/2">
      <h3 className="text-sm font-semibold tracking-wide text-sky-900">
        {type === "ITEM" ? "Item Income" : "Repair Income"}
      </h3>

      <p className="text-3xl font-extrabold text-sky-700">
        {total == null ? "…" : `Rs ${total.toLocaleString("en-LK")}`}
      </p>

      <span className="self-end text-xs text-gray-500">
        ({period.replace("last-", "").replace("-", " ")})
      </span>
    </div>
  );
}
