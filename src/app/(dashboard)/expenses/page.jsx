"use client";

import { useState, useEffect, useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { getExpenses, createExpense } from "@/utils/expensesService";
import { useAuth } from "../../providers";
import { useRouter } from "next/navigation";

const categories = [
  "Salesmen Wages",
  "Electricity Bill/Accessories",
  "Miscellaneous Expenses",
  "Repairs",
  "Others",
];

/* ─────────── grid columns ─────────── */
const columns = [
  { field: "id", headerName: "ID", width: 100 },
  {
    field: "amount",
    headerName: "Amount (Rs)",
    width: 150,
    type: "number",
  },
  { field: "description", headerName: "Description", flex: 1, minWidth: 200 },
  { field: "category", headerName: "Category", width: 200 },
  { field: "date", headerName: "Date", width: 120 },
];

export default function ExpensesPage() {
  const { role } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (role !== "admin") {
      router.replace("/items");
    }
  }, [role, router]);
  if (role !== "admin") return null;

  /* form + data state */
  const [form, setForm] = useState({
    amount: "",
    description: "",
    category: categories[0],
    date: new Date().toISOString().split("T")[0], // yyyy-mm-dd
  });
  const [expenses, setExpenses] = useState([]);
  const [saving, setSaving] = useState(false);

  /* ───── fetch all once ───── */
  const loadExpenses = async () => {
    try {
      const data = await getExpenses();
      setExpenses(
        data.map((e) => ({
          id: e.id,
          amount: e.amount,
          description: e.description,
          category: e.category,
          date: e.date,
        }))
      );
    } catch (err) {
      console.error("Error loading expenses:", err);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  /* ───── form handlers ───── */
  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.amount || !form.description) return;

    try {
      setSaving(true);
      await createExpense({
        amount: parseFloat(form.amount),
        description: form.description,
        category: form.category,
        date: form.date,
      });
      await loadExpenses(); // refresh list
      setForm({
        amount: "",
        description: "",
        category: categories[0],
        date: new Date().toISOString().split("T")[0],
      });
    } catch (err) {
      console.error("Failed to add expense:", err);
    } finally {
      setSaving(false);
    }
  }

  /* optional: sort newest first */
  const sortedExpenses = useMemo(
    () => [...expenses].sort((a, b) => b.id - a.id),
    [expenses]
  );

  /* ───── UI ───── */
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl font-extrabold tracking-wide">EXPENSES</h1>

      {/* new-expense form */}
      <div className="rounded-lg border border-sky-200 bg-white p-4 shadow-sm">
        <form
          onSubmit={handleSubmit}
          className="grid items-end gap-4 md:grid-cols-5"
        >
          <Input
            label="Amount (Rs)*"
            name="amount"
            type="number"
            min="0"
            value={form.amount}
            onChange={handleChange}
            required
          />
          <Input
            label="Description*"
            name="description"
            value={form.description}
            onChange={handleChange}
            required
          />
          <div>
            <label className="mb-1 block text-xs font-medium">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-sky-400"
            >
              {categories.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <Input
            label="Date"
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            disabled={saving}
            className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Add Expense"}
          </button>
        </form>
      </div>

      {/* expenses table */}
      <div className="rounded-lg border border-sky-200 bg-white shadow-sm">
        <div style={{ height: 420, width: "100%" }}>
          <DataGrid
            rows={sortedExpenses}
            columns={columns}
            hideFooter
            disableColumnMenu
            disableRowSelectionOnClick
            headerHeight={46}
            rowHeight={44}
            sx={{
              border: 0,
              "& .MuiDataGrid-virtualScroller": { bgcolor: "#eaf4fb" },
              "& .MuiDataGrid-columnHeaders": {
                bgcolor: "#cfe0ec",
                fontWeight: 700,
                "& .MuiDataGrid-columnSeparator": { display: "none" },
              },
              "& .MuiDataGrid-row:nth-of-type(even)": { bgcolor: "#f1f8fd" },
              "& .MuiDataGrid-row:hover": {
                bgcolor: "rgba(14,165,233,0.12)",
              },
            }}
          />
        </div>
      </div>
    </section>
  );
}

/* reusable input */
function Input({ label, type = "text", ...props }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium">{label}</label>
      <input
        type={type}
        {...props}
        className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-sky-400"
      />
    </div>
  );
}
