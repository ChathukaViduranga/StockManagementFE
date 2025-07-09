// src/app/(dashboard)/customers/page.jsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { getCustomers, createCustomer } from "@/utils/customerService";
import * as XLSX from "xlsx";
import { Download } from "lucide-react"; // ⬅ icon

/* ------------ grid columns ------------ */
const columns = [
  { field: "custId", headerName: "ID", width: 90 },
  { field: "name", headerName: "Customer Name", flex: 1, minWidth: 200 },
  { field: "phone", headerName: "Contact No", width: 140 },
  { field: "nic", headerName: "NIC", width: 140 },
  { field: "address", headerName: "Address", flex: 1.4, minWidth: 260 },
];

export default function CustomersPage() {
  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  /* form fields */
  const [form, setForm] = useState({
    name: "",
    contactNo: "",
    nic: "",
    address: "",
  });

  /* fetch customers */
  const loadCustomers = async () => {
    const data = await getCustomers();
    setRows(
      data.map((c) => ({
        id: c.id,
        custId: c.id,
        name: c.name,
        phone: c.contactNo,
        nic: c.nic,
        address: c.address,
      }))
    );
  };

  useEffect(() => {
    setMounted(true);
    loadCustomers().catch(console.error);
  }, []);

  /* add customer */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createCustomer(form);
      setToast("Customer added ✔");
      setForm({ name: "", contactNo: "", nic: "", address: "" });
      await loadCustomers();
    } catch {
      setToast("Failed to add customer");
    } finally {
      setSaving(false);
      setTimeout(() => setToast(""), 2500);
    }
  };

  /* search filter */
  const data = useMemo(() => {
    if (!query.trim()) return rows;
    const q = query.toLowerCase();
    return rows.filter(
      (r) =>
        r.custId.toString().includes(q) ||
        r.name.toLowerCase().includes(q) ||
        r.phone.includes(q) ||
        r.nic.toLowerCase().includes(q)
    );
  }, [query, rows]);

  /* export current view */
  const exportToExcel = () => {
    const exportRows = data.map(({ id, ...rest }) => rest);
    const ws = XLSX.utils.json_to_sheet(exportRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Customers");
    XLSX.writeFile(wb, "customers.xlsx");
  };

  /* UI */
  return (
    <section className="flex flex-col gap-5">
      <h1 className="text-2xl font-extrabold tracking-wide">CUSTOMERS</h1>

      {/* add form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-5 gap-3 bg-sky-50 p-4 rounded-lg"
      >
        <input
          required
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="rounded border px-2 py-1 text-sm"
        />
        <input
          required
          placeholder="Contact No"
          value={form.contactNo}
          onChange={(e) => setForm({ ...form, contactNo: e.target.value })}
          className="rounded border px-2 py-1 text-sm"
        />
        <input
          required
          placeholder="NIC"
          value={form.nic}
          onChange={(e) => setForm({ ...form, nic: e.target.value })}
          className="rounded border px-2 py-1 text-sm"
        />
        <input
          required
          placeholder="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          className="rounded border px-2 py-1 text-sm"
        />
        <button
          disabled={saving}
          className="bg-sky-600 text-white rounded-md text-sm font-semibold hover:bg-sky-700 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Add"}
        </button>
      </form>

      {toast && <p className="text-sm font-medium text-green-700">{toast}</p>}

      {/* toolbar: search + download */}
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search by ID, name, phone, NIC…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-72 rounded border border-gray-300 px-3 py-1 text-sm outline-sky-400"
        />
        <button
          onClick={exportToExcel}
          className="rounded-full bg-sky-600 p-2 text-white hover:bg-sky-700"
          title="Download Excel"
        >
          <Download size={18} />
        </button>
      </div>

      {/* data grid */}
      <div style={{ height: 450, width: "100%" }}>
        {mounted && (
          <DataGrid
            rows={data}
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
        )}
      </div>
    </section>
  );
}
