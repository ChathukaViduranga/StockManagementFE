// src/utils/expenseService.js
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_BASE_URL; // e.g. http://localhost:8080/api

/* ─────────────────────────────────────────────
   1.  GET all expenses   →  GET  /expenses
   ───────────────────────────────────────────── */
export const getExpenses = async () => {
  try {
    const res = await axios.get(`${API}/expenses`);
    return res.data; // array
  } catch (err) {
    console.error("Error fetching expenses:", err);
    throw err;
  }
};

/* ─────────────────────────────────────────────
   1a.  GET aggregated totals
        last-week  →  GET /expenses/last-week
        last-month →  GET /expenses/last-month
        last-year  →  GET /expenses/last-year
        Each returns a BigDecimal-string like "203500.00".
   ───────────────────────────────────────────── */
const fetchAggregate = async (path) => {
  try {
    const res = await axios.get(`${API}${path}`);
    return Number(res.data); // convert to JS number
  } catch (err) {
    console.error(`Error fetching expenses ${path}:`, err);
    throw err;
  }
};

export const getLastWeekExpense = () => fetchAggregate("/expenses/last-week");
export const getLastMonthExpense = () => fetchAggregate("/expenses/last-month");
export const getLastYearExpense = () => fetchAggregate("/expenses/last-year");

/* ─────────────────────────────────────────────
   2.  CREATE expense      →  POST /expenses
   ───────────────────────────────────────────── */
export const createExpense = async (payload) => {
  try {
    const res = await axios.post(`${API}/expenses`, payload);
    return res.data; // created expense
  } catch (err) {
    console.error("Error creating expense:", err);
    throw err;
  }
};
