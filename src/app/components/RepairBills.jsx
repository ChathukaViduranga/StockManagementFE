// src/app/components/RepairBills.jsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import * as XLSX from "xlsx";
import { Download } from "lucide-react";
import {
  getLastWeekRepairBills,
  getLastMonthRepairBills,
  getLastYearRepairBills,
} from "@/utils/billService";

/* ─────────── grid columns ─────────── */
const columns = [
  { field: "id", headerName: "Bill ID", width: 80 },
  { field: "date", headerName: "Date", width: 110 },
  { field: "repairId", headerName: "Repair ID", width: 90 },
  { field: "device", headerName: "Device", flex: 1, minWidth: 160 },
  { field: "customer", headerName: "Customer", flex: 1, minWidth: 140 },
  { field: "price", headerName: "Price (Rs)", width: 110, type: "number" },
  { field: "discount", headerName: "Disc. (Rs)", width: 100, type: "number" },
  { field: "net", headerName: "Net (Rs)", width: 110, type: "number" },
  { field: "profit", headerName: "Income (Rs)", width: 110, type: "number" },
];

/**
 * Props:
 *   period → "last-week" | "last-month" | "last-year"
 */
export default function RepairBills({ period }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  /* ─── fetch whenever period changes ─── */
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const list =
          period === "last-week"
            ? await getLastWeekRepairBills()
            : period === "last-month"
            ? await getLastMonthRepairBills()
            : await getLastYearRepairBills();

        if (!alive) return;

        const mapped = list.map((b) => ({
          id: b.id,
          date: new Date(b.billDate).toLocaleDateString("en-GB"),
          repairId: b.repair?.id,
          device: b.repair?.deviceName,
          customer: b.customer?.name,
          price: b.price,
          discount: b.discount,
          net: b.netAmount,
          profit: b.profit,
        }));
        setRows(mapped);
      } catch (err) {
        console.error("Repair-bill fetch error:", err);
        if (alive) setRows([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [period]);

  /* ─── simple client-side search ─── */
  const filtered = useMemo(() => {
    if (!query.trim()) return rows;
    const q = query.toLowerCase();
    return rows.filter(
      (r) =>
        r.id.toString().includes(q) ||
        (r.repairId ?? "").toString().includes(q) ||
        (r.device ?? "").toLowerCase().includes(q) ||
        (r.customer ?? "").toLowerCase().includes(q)
    );
  }, [query, rows]);

  /* ─── export XLSX ─── */
  const exportExcel = () => {
    const flat = filtered.map(({ id, ...rest }) => rest); // drop grid id
    const ws = XLSX.utils.json_to_sheet(flat);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "RepairIncome");
    XLSX.writeFile(wb, "repair_income.xlsx");
  };

  /* ─── UI ─── */
  return (
    <div className="rounded-lg border border-sky-200 bg-white shadow-sm mt-6">
      {/* header with search + export */}
      <div className="flex items-center justify-between px-4 py-2">
        <h2 className="font-bold text-sky-900">
          Repair Income – {period.replace("last-", "").replace("-", " ")}
        </h2>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-56 rounded border border-gray-300 px-3 py-1 text-sm outline-sky-400"
          />
          <button
            onClick={exportExcel}
            title="Download Excel"
            className="rounded-full bg-sky-600 p-2 text-white hover:bg-sky-700"
          >
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* data grid */}
      <div style={{ height: 360, width: "100%" }}>
        <DataGrid
          rows={filtered}
          columns={columns}
          loading={loading}
          pageSizeOptions={[5, 10, 25]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          disableColumnMenu
          disableRowSelectionOnClick
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
            "& .MuiDataGrid-cell--number": { textAlign: "center" },
          }}
        />
      </div>
    </div>
  );
}
