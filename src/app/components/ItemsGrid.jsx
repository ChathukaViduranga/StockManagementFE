"use client";

import { DataGrid } from "@mui/x-data-grid";

const columns = [
  { field: "no", headerName: "Item No", width: 110 },
  { field: "name", headerName: "Item Name", flex: 1, minWidth: 180 },
  { field: "qty", headerName: "Quantity", width: 110, type: "number" },
  {
    field: "cost",
    headerName: "Item Cost (LKR)",
    width: 150,
    type: "number",
  },
];

const rows = [
  { id: 1, no: "001", name: "Iphone X", qty: 15, cost: 170000 },
  { id: 2, no: "002", name: "Bass Drum Maxtone", qty: 5, cost: 29500 },
  { id: 3, no: "003", name: "Violin", qty: 12, cost: 64999 },
];

export default function ItemsGrid() {
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
