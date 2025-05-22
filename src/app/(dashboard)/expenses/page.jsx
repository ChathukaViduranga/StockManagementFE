"use client";

import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";

const categories = [
  "Salesmen Wages",
  "Electricity Bill/Accessories",
  "Miscellaneous Expenses",
  "Repairs",
  "Others",
];

export default function ExpensesPage() {
  const [form, setForm] = useState({
    id: "",
    amount: "",
    description: "",
    category: categories[0],
  });
  const [expenses, setExpenses] = useState([]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.id || !form.amount || !form.description || !form.category) return;

    setExpenses((prev) => [
      ...prev,
      { ...form, id: Date.now(), amount: parseFloat(form.amount) },
    ]);

    setForm({ id: "", amount: "", description: "", category: categories[0] });
  }

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "amount", headerName: "Amount (Rs)", width: 150, type: "number" },
    { field: "description", headerName: "Description", flex: 1, minWidth: 200 },
    { field: "category", headerName: "Category", width: 200 },
  ];

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl font-extrabold tracking-wide">EXPENSES</h1>

      {/* New expense form */}
      <div className="rounded-lg border border-sky-200 bg-white shadow-sm p-4">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
        >
          <Input
            label="Expense ID"
            name="id"
            value={form.id}
            onChange={handleChange}
          />
          <Input
            label="Amount (Rs)"
            name="amount"
            type="number"
            value={form.amount}
            onChange={handleChange}
          />
          <Input
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
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
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700"
          >
            Add Expense
          </button>
        </form>
      </div>

      {/* Expenses table */}
      <div className="rounded-lg border border-sky-200 bg-white shadow-sm">
        <div style={{ height: 420, width: "100%" }}>
          <DataGrid
            rows={expenses}
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
                color: "#0f172a",
                fontWeight: 700,
                fontSize: "0.9rem",
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
                "& .MuiDataGrid-columnSeparator": { display: "none" },
              },
              "& .MuiDataGrid-row": {
                bgcolor: "#ffffff",
                "&:nth-of-type(even)": { bgcolor: "#f1f8fd" },
                "& .MuiDataGrid-cell": {
                  fontSize: "0.88rem",
                  borderBottom: "1px solid #dbe4ed",
                },
              },
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
