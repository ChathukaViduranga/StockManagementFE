// src/app/(dashboard)/repairs/page.jsx
"use client";

import { useState, useEffect, useMemo } from "react";
import * as XLSX from "xlsx";
import { Download } from "lucide-react";
import RepairsGrid from "@/app/components/RepairsGrid";
import NewRepairForm from "@/app/components/NewRepairForm";
import {
  getRepairs,
  createRepair,
  changeRepairStatus,
} from "@/utils/repairService";

export default function RepairsPage() {
  /* ───────── state ───────── */
  const [rows, setRows] = useState([]);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");

  /* ───────── helpers ───────── */
  const loadRepairs = async () => {
    const data = await getRepairs();
    setRows(
      data.map((r) => ({
        id: r.id,
        no: r.id,
        customer: r.customer?.id ?? "-",
        name: r.deviceName,
        status:
          r.status.charAt(0).toUpperCase() + r.status.slice(1).toLowerCase(),
      }))
    );
  };

  const addRepair = async (payload) => {
    setSaving(true);
    try {
      await createRepair(payload);
      await loadRepairs();
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (id, next) => {
    try {
      await changeRepairStatus(id, next);
      await loadRepairs();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  /* ───────── lifecycle ───────── */
  useEffect(() => {
    loadRepairs().catch(console.error);
  }, []);

  /* ───────── search filter ───────── */
  const filtered = useMemo(() => {
    if (!query.trim()) return rows;
    const q = query.toLowerCase();
    return rows.filter(
      (r) =>
        r.no.toString().includes(q) ||
        r.customer.toString().includes(q) ||
        r.name.toLowerCase().includes(q) ||
        r.status.toLowerCase().includes(q)
    );
  }, [query, rows]);

  /* ───────── export xlsx ───────── */
  const exportExcel = () => {
    const flat = filtered.map(({ id, ...rest }) => rest); // omit grid key
    const ws = XLSX.utils.json_to_sheet(flat);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Repairs");
    XLSX.writeFile(wb, "repairs.xlsx");
  };

  /* ───────── UI ───────── */
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl font-extrabold tracking-wide">REPAIRS</h1>

      {/* new-repair form */}
      <div className="rounded-lg border border-sky-200 bg-white p-4 shadow-sm">
        <NewRepairForm onAdd={addRepair} saving={saving} />
      </div>

      {/* toolbar */}
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search repairs…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-72 rounded border border-gray-300 px-3 py-1 text-sm outline-sky-400"
        />
        <button
          onClick={exportExcel}
          className="rounded-full bg-sky-600 p-2 text-white hover:bg-sky-700"
          title="Download Excel"
        >
          <Download size={18} />
        </button>
      </div>

      {/* grid */}
      <div className="rounded-lg border border-sky-200 bg-white shadow-sm">
        <RepairsGrid rows={filtered} onStatusChange={updateStatus} />
      </div>
    </section>
  );
}
