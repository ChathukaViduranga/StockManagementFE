// src/utils/repairService.js
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_BASE_URL; // e.g. http://localhost:8080/api

/* ──────────────────────────────────────────
   1. GET  /repairs        → all repairs
   ────────────────────────────────────────── */
export const getRepairs = async () => {
  try {
    const res = await axios.get(`${API}/repairs`);
    return res.data; // array
  } catch (err) {
    console.error("Error fetching repairs:", err);
    throw err;
  }
};

/* ──────────────────────────────────────────
   1a. GET  /repairs/:id   → single repair
   ────────────────────────────────────────── */
export const getRepairById = async (id) => {
  try {
    const res = await axios.get(`${API}/repairs/${id}`);
    return res.data; // single repair object
  } catch (err) {
    console.error(`Error fetching repair #${id}:`, err);
    throw err;
  }
};

/* ──────────────────────────────────────────
   2. POST /repairs        → create repair
   ────────────────────────────────────────── */
export const createRepair = async (payload) => {
  try {
    // payload should already contain the correct enum value
    const res = await axios.post(`${API}/repairs`, payload);
    return res.data; // created repair
  } catch (err) {
    console.error("Error creating repair:", err);
    throw err;
  }
};

/* ──────────────────────────────────────────
   3. PUT  /repairs/:id    → update status
      Body: JSON string, e.g. "COMPLETED"
   ────────────────────────────────────────── */
export const changeRepairStatus = async (id, newStatus) => {
  try {
    const body = JSON.stringify(newStatus);
    const res = await axios.put(`${API}/repairs/${id}`, body, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data; // updated repair
  } catch (err) {
    console.error(`Error updating repair #${id}:`, err);
    throw err;
  }
};
