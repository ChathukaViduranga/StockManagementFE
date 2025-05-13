"use client";

import { useState, useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";

/* ---------- columns ---------- */
const columns = [
  { field: "no", headerName: "Repair No", width: 110 },
  { field: "customer", headerName: "Customer", flex: 1, minWidth: 180 },
  { field: "name", headerName: "Device", flex: 1, minWidth: 180 },
  { field: "status", headerName: "Status", width: 110 },
];

/* ---------- rows ---------- */
const rows = [
  {
    id: 1,
    no: "1001",
    customer: "Visitha Perera",
    name: "A15 Samsung",
    status: "Pending",
  },
  {
    id: 2,
    no: "1002",
    customer: "Kalum Madushanka",
    name: "Piano",
    status: "Completed",
  },
  {
    id: 3,
    no: "1003",
    customer: "Vijitha Silva",
    name: "Flute",
    status: "Completed",
  },
];

export default function RepairsGrid() {
  const [query, setQuery] = useState("");

  /* filter rows when query changes */
  const data = useMemo(() => {
    if (!query.trim()) return rows;
    const q = query.toLowerCase();
    return rows.filter(
      (r) =>
        r.no.includes(q) ||
        r.customer.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q) ||
        r.status.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <>
      {/* search box */}
      <div className="mb-2 flex justify-end">
        <input
          type="text"
          placeholder="Search by repair no, customer, device, status…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-72 rounded border border-gray-300 px-3 py-1 text-sm outline-sky-400"
        />
      </div>

      <div style={{ height: 420, width: "100%" }}>
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
    </>
  );
}
