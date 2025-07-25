// src/app/(dashboard)/expenses/page.jsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";
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
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "amount",
    headerName: "Amount (Rs)",
    width: 140,
    type: "number",
    renderCell: (params) =>
      params.value != null ? Number(params.value).toLocaleString("en-LK") : "",
  },
  { field: "description", headerName: "Description", flex: 1, minWidth: 200 },
  { field: "category", headerName: "Category", width: 200 },
  { field: "date", headerName: "Date", width: 120 },
];

export default function ExpensesPage() {
  const { role } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (role !== "admin") router.replace("/items");
  }, [role, router]);
  if (role !== "admin") return null;

  /* state */
  const [form, setForm] = useState({
    amount: "",
    description: "",
    category: categories[0],
    date: new Date().toISOString().split("T")[0],
  });
  const [expenses, setExpenses] = useState([]);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");

  /* fetch */
  const loadExpenses = async () => {
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
  };
  useEffect(() => {
    loadExpenses().catch(console.error);
  }, []);

  /* form handlers */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || !form.description) return;
    try {
      setSaving(true);
      await createExpense({
        ...form,
        amount: parseFloat(form.amount),
      });
      await loadExpenses();
      setForm({
        amount: "",
        description: "",
        category: categories[0],
        date: new Date().toISOString().split("T")[0],
      });
    } finally {
      setSaving(false);
    }
  };

  /* search filter */
  const filtered = useMemo(() => {
    if (!query.trim()) return expenses;
    const q = query.toLowerCase();
    return expenses.filter(
      (e) =>
        e.id.toString().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q)
    );
  }, [query, expenses]);

  /* export */
  const exportExcel = () => {
    const rows = filtered.map(({ id, ...rest }) => rest);
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Expenses");
    XLSX.writeFile(wb, "expenses.xlsx");
  };

  /* UI */
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl font-extrabold tracking-wide">EXPENSES</h1>

      {/* add form */}
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
              {categories.map((c) => (
                <option key={c}>{c}</option>
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

      {/* toolbar */}
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search by ID, description, category…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-80 rounded border border-gray-300 px-3 py-1 text-sm outline-sky-400"
        />
        <button
          onClick={exportExcel}
          className="rounded-full bg-sky-600 p-2 text-white hover:bg-sky-700"
          title="Download Excel"
        >
          <Download size={18} />
        </button>
      </div>

      {/* table */}
      <div className="rounded-lg border border-sky-200 bg-white shadow-sm">
        <div style={{ height: 420, width: "100%" }}>
          <DataGrid
            rows={filtered}
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
