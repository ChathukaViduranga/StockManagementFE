"use client";

import { useState } from "react";

export default function NewRepairForm({ onAdd, saving }) {
  const [form, setForm] = useState({
    customerId: "",
    deviceName: "",
    status: "Pending",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.customerId || !form.deviceName) return;

    await onAdd({
      customer: { id: Number(form.customerId) },
      deviceName: form.deviceName,
      status: form.status,
    });

    setForm({ customerId: "", deviceName: "", status: "Pending" });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid items-end gap-4 md:grid-cols-4"
    >
      <Input
        label="Customer ID*"
        name="customerId"
        value={form.customerId}
        onChange={handleChange}
        type="number"
        min="1"
        required
      />
      <Input
        label="Device Name*"
        name="deviceName"
        value={form.deviceName}
        onChange={handleChange}
        required
      />
      <div>
        <label className="mb-1 block text-xs font-medium">Status</label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-sky-400"
        >
          {["Pending", "In_Progress", "Completed", "Delivered"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={saving}
        className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold text-white
                   hover:bg-sky-700 disabled:opacity-60"
      >
        {saving ? "Saving…" : "Add Repair"}
      </button>
    </form>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium">{label}</label>
      <input
        {...props}
        className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-sky-400"
      />
    </div>
  );
}
