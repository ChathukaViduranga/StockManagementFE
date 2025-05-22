"use client";
import { useState } from "react";

export default function NewRepairForm({ onAdd }) {
  const [form, setForm] = useState({ no: "", customer: "", name: "" });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.no || !form.customer || !form.name) return;

    onAdd({
      id: Date.now(), // unique row key
      no: form.no,
      customer: form.customer,
      name: form.name,
      status: "Pending",
    });

    setForm({ no: "", customer: "", name: "" });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-4 md:grid-cols-4 items-end"
    >
      <Input
        label="Repair ID"
        name="no"
        value={form.no}
        onChange={handleChange}
      />
      <Input
        label="Customer ID"
        name="customer"
        value={form.customer}
        onChange={handleChange}
      />
      <Input
        label="Device Name"
        name="name"
        value={form.name}
        onChange={handleChange}
      />

      <button
        type="submit"
        className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700"
      >
        Add Repair
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
