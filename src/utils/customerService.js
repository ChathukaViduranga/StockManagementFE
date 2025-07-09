// utils/customerService.js
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_BASE_URL; // e.g. "http://localhost:8080/api"

/* --------------- GET all customers ---------------- */
export const getCustomers = async () => {
  try {
    const res = await axios.get(`${API}/customers`);
    return res.data; // <-- already parsed array
  } catch (err) {
    console.error("Error fetching customers:", err);
    throw err;
  }
};

/* --------------- GET one customer ----------------- */
export const getCustomerById = async (id) => {
  try {
    const res = await axios.get(`${API}/customers/${id}`);
    return res.data; // <-- single object
  } catch (err) {
    console.error("Error fetching customer:", err);
    throw err;
  }
};

export const getCustomerByContactNumber = async (contactNumber) => {
  try {
    const res = await axios.get(
      `${API}/customers/contact-number/${contactNumber}`
    );
    return res.data; // <-- single object
  } catch (err) {
    console.error("Error fetching customer:", err);
    throw err;
  }
};

/* --------------- POST create customer ------------- */
export const createCustomer = async (payload) => {
  try {
    const res = await axios.post(`${API}/customers`, payload);
    return res.data; // <-- created object with ID
  } catch (err) {
    console.error("Error creating customer:", err);
    throw err;
  }
};
