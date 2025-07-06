"use client";

import { useState, useMemo, useEffect } from "react";
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
import { getAvailableItems } from "@/utils/ItemService";

/* --------- grid columns --------- */
const columns = [
  { field: "no", headerName: "Item No", width: 110 },
  { field: "name", headerName: "Item Name", flex: 1, minWidth: 180 },
  { field: "price", headerName: "Price (Rs)", width: 110, type: "number" },
  { field: "cost", headerName: "Cost (Rs)", width: 130, type: "number" },
];

export default function ItemsGrid() {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [selected, setSelect] = useState(null);

  /* ---- fetch available items on mount ---- */
  useEffect(() => {
    (async () => {
      try {
        const data = await getAvailableItems(); // ← API call

        // map API → grid shape
        const mapped = data.map((item) => ({
          id: item.id,
          no: item.id, // or `item.itemNo` if you keep string pk
          name: item.name,
          price: item.sellingPrice,
          cost: item.cost,
          img: item.imagePath || "/placeholder.png",
          desc: item.description,
        }));
        setRows(mapped);
      } catch (err) {
        console.error("Failed to load items:", err);
      }
    })();
  }, []);

  /* ---- live filtering ---- */
  const filteredRows = useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.toLowerCase();
    return rows.filter(
      (r) => r.no.toString().includes(q) || r.name.toLowerCase().includes(q)
    );
  }, [search, rows]);

  function handleRowClick(params) {
    setSelect(params.row);
    setOpen(true);
  }

  return (
    <>
      {/* search bar */}
      <div className="mb-2 flex justify-end">
        <input
          type="text"
          placeholder="Search by ID or name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-60 rounded border border-gray-300 px-3 py-1 text-sm outline-sky-400"
        />
      </div>

      {/* data grid */}
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

      {/* dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        {selected && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{selected.name}</DialogTitle>
              <DialogDescription>{selected.desc}</DialogDescription>
            </DialogHeader>

            <div className="relative h-56 w-full">
              <Image
                src={
                  selected.img.startsWith("/api/uploads/") ||
                  selected.img.startsWith("http")
                    ? selected.img
                    : selected.img.startsWith("/images/") ||
                      selected.img.startsWith("/assets/")
                    ? selected.img
                    : "/placeholder.png"
                }
                alt={selected.name}
                fill
                className="object-contain rounded border"
                unoptimized
              />
            </div>

            <ul className="mt-4 space-y-1 text-sm">
              <li>
                <span className="font-medium">Item No:</span> {selected.no}
              </li>
              <li>
                <span className="font-medium">Selling Price:</span> Rs.&nbsp;
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
