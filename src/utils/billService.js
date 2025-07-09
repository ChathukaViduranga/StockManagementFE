// src/utils/billService.js
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_BASE_URL; // e.g. http://localhost:8080/api

/*─────────────────────────────────────────*
 * 0. tiny helpers (reuse everywhere)
 *─────────────────────────────────────────*/
const fetchAggregate = async (path) => {
  const { data } = await axios.get(`${API}${path}`);
  return Number(data); // BigDecimal → JS number
};

const fetchList = async (path) => {
  const { data } = await axios.get(`${API}${path}`);
  return data; // array of Bill objects
};

/*─────────────────────────────────────────*
 * 1. BASIC BILL QUERIES
 *─────────────────────────────────────────*/
export const getBills = () => fetchList("/bills");
export const getDailyRevenue = () => fetchList("/bills/daily");

/* 1b. aggregated income totals */
export const getLastWeekRevenue = () => fetchAggregate("/bills/last-week");
export const getLastMonthRevenue = () => fetchAggregate("/bills/last-month");
export const getLastYearRevenue = () => fetchAggregate("/bills/last-year");

/* 1c. item-bill lists */
export const getLastWeekItemBills = () => fetchList("/bills/last-week-items");
export const getLastMonthItemBills = () => fetchList("/bills/last-month-items");
export const getLastYearItemBills = () => fetchList("/bills/last-year-items");

/* 1d. repair-bill lists */
export const getLastWeekRepairBills = () =>
  fetchList("/bills/last-week-repairs");
export const getLastMonthRepairBills = () =>
  fetchList("/bills/last-month-repairs");
export const getLastYearRepairBills = () =>
  fetchList("/bills/last-year-repairs");

/* 1e. ⬇ NEW ⬇  item-bill *profit* totals */
export const getLastWeekItemProfit = () =>
  fetchAggregate("/bills/last-week-item-profit");
export const getLastMonthItemProfit = () =>
  fetchAggregate("/bills/last-month-item-profit");
export const getLastYearItemProfit = () =>
  fetchAggregate("/bills/last-year-item-profit");

export const getLastWeekRepairProfit = () =>
  fetchAggregate("/bills/last-week-repair-profit");
export const getLastMonthRepairProfit = () =>
  fetchAggregate("/bills/last-month-repair-profit");
export const getLastYearRepairProfit = () =>
  fetchAggregate("/bills/last-year-repair-profit");

/*─────────────────────────────────────────*
 * 2. CREATE BILL
 *─────────────────────────────────────────*/
const createBill = async (payload) => {
  const { data } = await axios.post(`${API}/bills`, payload);
  return data; // created Bill object
};

/* ––– helper wrappers for clarity ––– */
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
