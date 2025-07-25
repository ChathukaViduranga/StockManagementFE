"use client";

import { useState } from "react";

const ROLES = [
  { label: "Admin", value: "admin" },
  { label: "Worker", value: "worker" },
];

export default function AddUserPage() {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    nic: "",
    username: "",
    password: "",
    confirmPassword: "",
    role: "worker",
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setToast("Passwords do not match");
      return;
    }
    // TODO: Add API call to save user
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setToast("User added ✔");
      setForm({
        name: "",
        mobile: "",
        nic: "",
        username: "",
        password: "",
        confirmPassword: "",
        role: "worker",
      });
    }, 1000);
  }

  return (
    <section className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4">
      <h1 className="mb-6 text-2xl font-extrabold tracking-wide text-center">
        ADD USER
      </h1>
      <div className="w-full max-w-md rounded-lg border border-sky-200 bg-white p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Input
            label="Name*"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <Input
            label="Mobile Number*"
            name="mobile"
            value={form.mobile}
            onChange={handleChange}
            required
          />
          <Input
            label="NIC*"
            name="nic"
            value={form.nic}
            onChange={handleChange}
            required
          />
          <Input
            label="Username*"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />
          <Input
            label="Password*"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <Input
            label="Confirm Password*"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
          <div>
            <label className="mb-1 block text-sm font-medium">Role*</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-sky-400"
              required
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="self-start rounded bg-[#0d1a38] px-6 py-2 text-sm font-semibold tracking-wide text-white hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Add User"}
          </button>
        </form>
        {toast && (
          <p className="mt-4 text-sm font-medium text-green-700">{toast}</p>
        )}
      </div>
    </section>
  );
}

function Input({ label, type = "text", ...props }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <input
        type={type}
        {...props}
        className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-sky-400"
      />
    </div>
  );
}
