"use client";

import { useState, useEffect, useMemo } from "react";
import RepairsGrid from "@/app/components/RepairsGrid";
import NewRepairForm from "@/app/components/NewRepairForm";
import {
  getRepairs,
  createRepair,
  changeRepairStatus,
} from "@/utils/repairService";

export default function RepairsPage() {
  const [rows, setRows] = useState([]);
  const [saving, setSaving] = useState(false);

  const updateStatus = async (id, next) => {
    try {
      -(await changeRepairStatus(id, next)); // PUT /repairs/:id
      -(
        // rows were not refreshed ⇒ UI stayed stale
        +(await changeRepairStatus(id, next))
      ); // PUT /repairs/:id
      +(await loadRepairs()); // ← fetch fresh list
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  /* ────── fetch repairs once ────── */
  const loadRepairs = async () => {
    try {
      const data = await getRepairs();
      setRows(
        data.map((r) => ({
          id: r.id, // DataGrid key
          no: r.id, // “Repair No”
          customer: r.customer?.id ?? "-", // customer ID
          name: r.deviceName,
          status:
            r.status?.charAt(0).toUpperCase() + // Pretty “Pending”
            r.status?.slice(1).toLowerCase(),
        }))
      );
    } catch (err) {
      console.error("Error fetching repairs:", err);
    }
  };

  useEffect(() => {
    loadRepairs();
  }, []);

  /* ────── add new repair ────── */
  const addRepair = async (payload) => {
    try {
      setSaving(true);
      await createRepair(payload); // POST /repairs
      await loadRepairs(); // refresh table
    } catch (err) {
      console.error("Failed to add repair:", err);
    } finally {
      setSaving(false);
    }
  };

  /* optional: newest first */
  const sortedRows = useMemo(
    () => [...rows].sort((a, b) => b.id - a.id),
    [rows]
  );

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl font-extrabold tracking-wide">REPAIRS</h1>

      {/* New repair entry */}
      <div className="rounded-lg border border-sky-200 bg-white p-4 shadow-sm">
        <NewRepairForm onAdd={addRepair} saving={saving} />
      </div>

      {/* Repairs table */}
      <div className="rounded-lg border border-sky-200 bg-white shadow-sm">
        <RepairsGrid rows={sortedRows} onStatusChange={updateStatus} />
      </div>
    </section>
  );
}
