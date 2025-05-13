"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { DataGrid } from "@mui/x-data-grid";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

/* ---------------- columns ---------------- */
const columns = [
  { field: "no", headerName: "Item No", width: 110 },
  { field: "name", headerName: "Item Name", flex: 1, minWidth: 180 },
  { field: "price", headerName: "Price (Rs)", width: 110, type: "number" },
  { field: "cost", headerName: "Cost (Rs)", width: 130, type: "number" },
];

/* ---------------- data ---------------- */
const rows = [
  {
    id: 1,
    no: "001",
    name: "iPhone X",
    price: 150000,
    cost: 170000,
    img: "/assets/items/iphone-x.png",
    desc: "64 GB · Space Gray",
  },
  {
    id: 2,
    no: "002",
    name: "Bass Drum Maxtone",
    price: 25000,
    cost: 29500,
    img: "/assets/items/bass-drum.png",
    desc: "22‑inch maple shell",
  },
  {
    id: 3,
    no: "003",
    name: "Violin",
    price: 64000,
    cost: 64999,
    img: "/assets/items/violin.png",
    desc: "Full‑size spruce & maple",
  },
];

export default function ItemsGrid() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [selected, setSelect] = useState(null);

  /* ----------- filter rows when search changes ----------- */
  const filteredRows = useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.toLowerCase();
    return rows.filter(
      (r) => r.no.includes(q) || r.name.toLowerCase().includes(q)
    );
  }, [search]);

  function handleRowClick(params) {
    setSelect(params.row);
    setOpen(true);
  }

  return (
    <>
      {/* -------- search bar -------- */}
      <div className="mb-2 flex justify-end">
        <input
          type="text"
          placeholder="Search by ID or name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-60 rounded border border-gray-300 px-3 py-1 text-sm outline-sky-400"
        />
      </div>

      {/* -------- data grid -------- */}
      <div style={{ height: 420, width: "100%" }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          hideFooter
          disableColumnMenu
          disableRowSelectionOnClick
          onRowClick={handleRowClick}
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
              cursor: "pointer",
              "&:nth-of-type(even)": { bgcolor: "#f1f8fd" },
              "& .MuiDataGrid-cell": {
                fontSize: "0.88rem",
                borderBottom: "1px solid #dbe4ed",
              },
            },
            "& .MuiDataGrid-row:hover": {
              bgcolor: "rgba(14,165,233,0.12)",
            },
            "& .MuiDataGrid-cell--number": { textAlign: "center" },
          }}
        />
      </div>

      {/* -------- dialog -------- */}
      <Dialog open={open} onOpenChange={setOpen}>
        {selected && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{selected.name}</DialogTitle>
              <DialogDescription>{selected.desc}</DialogDescription>
            </DialogHeader>

            <div className="relative w-full h-56">
              <Image
                src={selected.img}
                alt={selected.name}
                fill
                className="object-contain rounded border"
              />
            </div>

            <ul className="mt-4 space-y-1 text-sm">
              <li>
                <span className="font-medium">Item No:</span> {selected.no}
              </li>
              <li>
                <span className="font-medium">Selling Price:</span> Rs.&nbsp;
                {selected.price.toLocaleString("en-LK")}
              </li>
              <li>
                <span className="font-medium">Cost:</span> Rs.&nbsp;
                {selected.cost.toLocaleString("en-LK")}
              </li>
            </ul>

            <DialogClose className="mt-6 rounded bg-sky-300 px-4 py-2 text-sm font-bold text-white hover:bg-sky-400">
              Close
            </DialogClose>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
