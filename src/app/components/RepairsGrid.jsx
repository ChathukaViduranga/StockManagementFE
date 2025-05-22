"use client";

import { DataGrid } from "@mui/x-data-grid";

/* -------- columns stay constant -------- */
const columns = [
  { field: "no", headerName: "Repair No", width: 110 },
  { field: "customer", headerName: "Customer ID", width: 140 },
  { field: "name", headerName: "Device", flex: 1, minWidth: 180 },
  { field: "status", headerName: "Status", width: 110 },
];

export default function RepairsGrid({ rows }) {
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
  );
}
