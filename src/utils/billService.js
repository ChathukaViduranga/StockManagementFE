// src/utils/billService.js
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_BASE_URL; // e.g. http://localhost:8080/api

/* ─────────────────────────────────────────
   1.  GET all bills   →  GET  /bills
   ───────────────────────────────────────── */
export const getBills = async () => {
  try {
    const res = await axios.get(`${API}/bills`);
    return res.data;
  } catch (err) {
    console.error("Error fetching bills:", err);
    throw err;
  }
};

/* ─────────────────────────────────────────
   1a.  GET daily revenue (last 7 entries)
        →  GET /bills/daily
   ───────────────────────────────────────── */
export const getDailyRevenue = async () => {
  try {
    const res = await axios.get(`${API}/bills/daily`);
    return res.data; // number[]
  } catch (err) {
    console.error("Error fetching daily revenue:", err);
    throw err;
  }
};

/* ─────────────────────────────────────────
   1b.  GET aggregated income
        last-week  →  GET /bills/last-week
        last-month →  GET /bills/last-month
        last-year  →  GET /bills/last-year
        Endpoints return a BigDecimal-like number.
   ───────────────────────────────────────── */
const fetchAggregate = async (path) => {
  try {
    const res = await axios.get(`${API}${path}`);
    return Number(res.data); // ensure JS number
  } catch (err) {
    console.error(`Error fetching revenue ${path}:`, err);
    throw err;
  }
};

export const getLastWeekRevenue = () => fetchAggregate("/bills/last-week");
export const getLastMonthRevenue = () => fetchAggregate("/bills/last-month");
export const getLastYearRevenue = () => fetchAggregate("/bills/last-year");

/* ─────────────────────────────────────────
   2.  CREATE bill (item OR repair)
   ───────────────────────────────────────── */
const createBill = async (payload) => {
  try {
    const res = await axios.post(`${API}/bills`, payload);
    return res.data;
  } catch (err) {
    console.error("Error creating bill:", err.response?.data || err);
    throw err;
  }
};

export const createItemBill = ({
  customerId,
  itemId,
  salesmanId,
  price,
  discount,
  netAmount,
  profit,
}) =>
  createBill({
    customer: { id: customerId },
    item: { id: itemId },
    salesmanId,
    price,
    discount,
    netAmount,
    profit,
  });

export const createRepairBill = ({
  customerId,
  repairId,
  salesmanId,
  price,
  discount,
  netAmount,
  profit,
}) =>
  createBill({
    customer: { id: customerId },
    repair: { id: repairId },
    salesmanId,
    price,
    discount,
    netAmount,
    profit,
  });
