"use client";

import { DataGrid } from "@mui/x-data-grid";

const columns = [
  { field: "no", headerName: "Repair No", width: 110, type: "number" },
  { field: "customer", headerName: "Customer", flex: 1, minWidth: 180 },
  { field: "name", headerName: "Device", flex: 1, minWidth: 180 },
  { field: "status", headerName: "Status", width: 110, type: "number" },
];

const rows = [
  {
    id: 1,
    no: "1001",
    customer: "Visitha Perera",
    name: "A15 Samsung",
    status: "Pending",
  },
  {
    id: 2,
    no: "1002",
    customer: "Kalum Madushanka",
    name: "Piano",
    status: "Completed",
  },
  {
    id: 3,
    no: "1003",
    customer: "Vijitha Silva",
    name: "Flute",
    status: "Completed",
  },
];

export default function RepairsGrid() {
  return (
    <div style={{ height: 420, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        hideFooter
        disableColumnMenu
        disableRowSelectionOnClick
        headerHeight={46}
        rowHeight={44}
        sx={{
          /* --- overall wrapper --- */
          border: 0,
          "& .MuiDataGrid-virtualScroller": {
            bgcolor: "#eaf4fb", // light blue fill under the rows
          },

          /* --- header row --- */
          "& .MuiDataGrid-columnHeaders": {
            bgcolor: "#cfe0ec", // sky‑200
            color: "#0f172a", // slate‑900
            fontWeight: 700,
            fontSize: "0.9rem",
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            "& .MuiDataGrid-columnSeparator": { display: "none" },
          },

          /* --- body rows --- */
          "& .MuiDataGrid-row": {
            bgcolor: "#ffffff",
            "&:nth-of-type(even)": {
              bgcolor: "#f1f8fd", // zebra stripe
            },
            "& .MuiDataGrid-cell": {
              fontSize: "0.88rem",
              borderBottom: "1px solid #dbe4ed",
            },
          },

          /* --- hover effect --- */
          "& .MuiDataGrid-row:hover": {
            bgcolor: "rgba(14,165,233,0.12)", // light sky‑500
          },

          /* --- centre numeric cells --- */
          "& .MuiDataGrid-cell--number": {
            textAlign: "center",
          },
        }}
      />
    </div>
  );
}
