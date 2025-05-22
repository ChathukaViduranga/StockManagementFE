"use client";
import { useState } from "react";
import RepairsGrid from "@/app/components/RepairsGrid";
import NewRepairForm from "@/app/components/NewRepairForm";

// export const metadata = { title: "Repairs" };

const initialRows = [
  {
    id: 1,
    no: "1001",
    customer: "C001",
    name: "A15 Samsung",
    status: "Pending",
  },
  { id: 2, no: "1002", customer: "C002", name: "Piano", status: "Completed" },
  { id: 3, no: "1003", customer: "C003", name: "Flute", status: "Completed" },
];

export default function RepairsPage() {
  const [rows, setRows] = useState(initialRows);

  function addRepair(newRow) {
    setRows((r) => [...r, newRow]);
  }

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl font-extrabold tracking-wide">REPAIRS</h1>

      {/* New repair entry */}
      <div className="rounded-lg border border-sky-200 bg-white shadow-sm p-4">
        <NewRepairForm onAdd={addRepair} />
      </div>

      {/* Repairs table */}
      <div className="rounded-lg border border-sky-200 bg-white shadow-sm">
        <RepairsGrid rows={rows} />
      </div>
    </section>
  );
}
