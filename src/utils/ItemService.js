// src/utils/itemService.js
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_BASE_URL; // e.g. "http://localhost:8080/api"

/* ─────────────────────────────────────────
   1.  Get ALL items  →  GET  /items
   ───────────────────────────────────────── */
export const getItems = async () => {
  try {
    const res = await axios.get(`${API}/items`);
    return res.data; // already parsed JSON array
  } catch (err) {
    console.error("Error fetching items:", err);
    throw err;
  }
};

/* ─────────────────────────────────────────
   2.  Get ONE item  →  GET  /items/:id
   ───────────────────────────────────────── */
export const getItemById = async (id) => {
  try {
    const res = await axios.get(`${API}/items/${id}`);
    return res.data; // object
  } catch (err) {
    console.error(`Error fetching item ${id}:`, err);
    throw err;
  }
};

/* ─────────────────────────────────────────
   3.  Create item   →  POST  /items
       payload shape:
       {
         name, sellingPrice, cost,
         description, imagePath
       }
   ───────────────────────────────────────── */
export const createItem = async (payload) => {
  try {
    const res = await axios.post(`${API}/items`, payload);
    return res.data; // created item with ID
  } catch (err) {
    console.error("Error creating item:", err);
    throw err;
  }
};

/* ─────────────────────────────────────────
   4.  Change status →  PUT  /items/:id
       status must be one of:
       "AVAILABLE", "OUT_OF_STOCK", "DISCONTINUED"
   ───────────────────────────────────────── */
export const changeItemStatus = async (id, status) => {
  try {
    // Back-end expects raw JSON string, e.g. "OUT_OF_STOCK"
    const res = await axios.put(`${API}/items/${id}`, JSON.stringify(status), {
      headers: { "Content-Type": "application/json" },
    });
    return res.data; // updated item
  } catch (err) {
    console.error(`Error updating status for item ${id}:`, err);
    throw err;
  }
};

/* ─────────────────────────────────────────
   5.  Get ONLY available items → GET /items/available
   ───────────────────────────────────────── */
export const getAvailableItems = async () => {
  try {
    const res = await axios.get(`${API}/items/available`);
    return res.data; // array
  } catch (err) {
    console.error("Error fetching available items:", err);
    throw err;
  }
};
