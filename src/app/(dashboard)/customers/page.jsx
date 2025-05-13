"use client";

import { useState, useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";

/* ------------ grid columns ------------ */
const columns = [
  { field: "custId", headerName: "ID", width: 100 },
  { field: "name", headerName: "Customer Name", flex: 1, minWidth: 200 },
  { field: "phone", headerName: "Contact No", width: 140 },
  { field: "nic", headerName: "NIC", width: 160 },
  { field: "address", headerName: "Address", flex: 1.4, minWidth: 260 },
];

/* ------------ sample data ------------ */
const rows = [
  {
    id: 1,
    custId: "C001",
    name: "Tharindu Perera",
    phone: "0771234567",
    address: "12, Flower Rd, Colombo 07",
    nic: "950871234V",
  },
  {
    id: 2,
    custId: "C002",
    name: "Nimali Fernando",
    phone: "0718765432",
    address: "22/4, Galle Rd, Dehiwala",
    nic: "982341234V",
  },
  {
    id: 3,
    custId: "C003",
    name: "Kasun Jayasinghe",
    phone: "0759876543",
    address: "55, Kandy Rd, Kegalle",
    nic: "912345678V",
  },
];

export default function CustomersPage() {
  const [query, setQuery] = useState("");

  /* filter rows on id / name / phone / nic */
  const data = useMemo(() => {
    if (!query.trim()) return rows;
    const q = query.toLowerCase();
    return rows.filter(
      (r) =>
        r.custId.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q) ||
        r.phone.includes(q) ||
        r.nic.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl font-extrabold tracking-wide">CUSTOMERS</h1>

      {/* search */}
      <div className="flex justify-end">
        <input
          type="text"
          placeholder="Search by ID, name, phone, NIC…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-72 rounded border border-gray-300 px-3 py-1 text-sm outline-sky-400"
        />
      </div>

      {/* grid */}
      <div style={{ height: 450, width: "100%" }}>
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
              color: "#0f172a",
              fontWeight: 700,
              fontSize: "0.9rem",
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              "& .MuiDataGrid-columnSeparator": { display: "none" },
            },
            "& .MuiDataGrid-row": {
              bgcolor: "#fff",
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
    </section>
  );
}
