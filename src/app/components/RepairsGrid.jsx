"use client";

import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@/components/ui/button"; // shadcn/ui button (or use <button>)

const columns = [
  { field: "no", headerName: "Repair No", width: 110 },
  { field: "customer", headerName: "Customer ID", width: 120 },
  { field: "name", headerName: "Device", flex: 1, minWidth: 180 },
  { field: "status", headerName: "Status", width: 120 },

  /* ───── action column ───── */
  {
    field: "action",
    headerName: "",
    width: 140,
    sortable: false,
    filterable: false,
    renderCell: ({ row }) => {
      const next =
        row.status === "Pending"
          ? "InProgress"
          : row.status === "Inprogress"
          ? "Completed"
          : null; // Delivered → no further step

      return (
        <Button
          size="sm"
          disabled={!next}
          onClick={() => next && row.onAdvance(next)}
          className="bg-sky-600 hover:bg-sky-700 text-white disabled:opacity-40"
        >
          {next ? `Mark ${next}` : "—"}
        </Button>
      );
    },
  },
];

export default function RepairsGrid({ rows, onStatusChange }) {
  /* inject helper into each row once (stable reference) */
  const rowsWithHandler = rows.map((r) => ({
    ...r,
    onAdvance: (next) => onStatusChange(r.id, next),
  }));

  return (
    <div style={{ height: 420, width: "100%" }}>
      <DataGrid
        rows={rowsWithHandler}
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
          "& .MuiDataGrid-row:hover": { bgcolor: "rgba(14,165,233,0.12)" },
        }}
      />
    </div>
  );
}
