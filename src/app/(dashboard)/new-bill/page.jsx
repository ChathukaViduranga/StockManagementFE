// src/app/(dashboard)/bills/new/page.jsx
"use client";

import { useState } from "react";
import { jsPDF } from "jspdf";
import { RefreshCcw } from "lucide-react";

import { getAvailableItemsById, changeItemStatus } from "@/utils/ItemService";
import {
  getCustomerById,
  getCustomerByContactNumber,
} from "@/utils/customerService";
import { getRepairById, changeRepairStatus } from "@/utils/repairService";
import { createItemBill, createRepairBill } from "@/utils/billService";

/* ---------- helper ---------- */
const freshBill = () => ({
  price: "",
  discount: "",
  salesman: "",
  custId: "",
  custName: "",
  address: "",
  mobile: "",
  nic: "",
  /* item */ itemNo: "",
  itemName: "",
  itemCost: 0,
  /* repair */ repairNo: "",
  deviceName: "",
});

export default function NewBillPage() {
  const [type, setType] = useState("ITEM"); // "ITEM" | "REPAIR"
  const [bill, setBill] = useState(freshBill());
  const [saving, setSaving] = useState(false);

  const resetForm = () => setBill(freshBill());
  const handleChange = (e) =>
    setBill({ ...bill, [e.target.name]: e.target.value });

  const calcNet = () =>
    (Number(bill.price || 0) - Number(bill.discount || 0)).toFixed(2);

  /* ---------- fetch helpers ---------- */
  const handleFetchItem = async () => {
    if (!bill.itemNo) return;
    try {
      const it = await getAvailableItemsById(bill.itemNo);
      if (!it || !it.id) {
        alert(
          "This item is currently not available for billing. Please check the item number or select another item."
        );
        setBill((b) => ({ ...b, itemName: "", price: "", itemCost: 0 }));
        return;
      }
      setBill((b) => ({
        ...b,
        itemName: it.name,
        price: it.sellingPrice,
        itemCost: it.cost,
      }));
    } catch (err) {
      // If error message is 'No AVAILABLE item found for id: ...'
      if (
        err?.response?.data &&
        typeof err.response.data === "string" &&
        err.response.data.includes("No AVAILABLE item")
      ) {
        alert(
          "This item is currently not available for billing. Please check the item number or select another item."
        );
        setBill((b) => ({ ...b, itemName: "", price: "", itemCost: 0 }));
      } else {
        alert("Item not found");
      }
    }
  };

  const fillCustomer = (c) =>
    setBill((b) => ({
      ...b,
      custId: c.id,
      custName: c.name,
      address: c.address,
      mobile: c.contactNo,
      nic: c.nic,
    }));

  const handleFetchCustomer = async () => {
    if (!bill.custId) return;
    try {
      const c = await getCustomerById(bill.custId);
      fillCustomer(c);
    } catch {
      alert("Customer not found");
    }
  };

  const handleFetchCustomerByMobile = async () => {
    if (!bill.mobile) return;
    try {
      const c = await getCustomerByContactNumber(bill.mobile);
      fillCustomer(c);
    } catch {
      alert("Customer not found");
    }
  };

  const handleFetchRepair = async () => {
    if (!bill.repairNo) return;
    try {
      const r = await getRepairById(bill.repairNo);
      // Check status
      if (!r || !r.status) {
        alert("Repair not found");
        return;
      }
      if (r.status === "Delivered") {
        alert(
          "This repair has already been delivered and cannot be billed again."
        );
        setBill((b) => ({ ...b, deviceName: "" }));
        return;
      }
      if (r.status !== "Completed") {
        alert(
          "Repair is not completed yet. Only completed repairs can be billed."
        );
        setBill((b) => ({ ...b, deviceName: "" }));
        return;
      }
      setBill((b) => ({ ...b, deviceName: r.deviceName }));
      if (r.customer?.id) {
        const c = await getCustomerById(r.customer.id);
        fillCustomer(c);
      }
    } catch {
      alert("Repair not found");
    }
  };

  /* ---------- persist + PDF ---------- */
  async function handleGenerate() {
    const netAmount = Number(calcNet());
    const price = Number(bill.price || 0);
    const discount = Number(bill.discount || 0);
    const profit =
      type === "ITEM"
        ? netAmount - Number(bill.itemCost || 0)
        : netAmount * 0.2;

    try {
      setSaving(true);

      if (type === "ITEM") {
        await createItemBill({
          customerId: Number(bill.custId),
          itemId: Number(bill.itemNo),
          salesmanId: bill.salesman,
          price,
          discount,
          netAmount,
          profit,
        });
        await changeItemStatus(Number(bill.itemNo), "OUT_OF_STOCK");
      } else {
        await createRepairBill({
          customerId: Number(bill.custId),
          repairId: Number(bill.repairNo),
          salesmanId: bill.salesman,
          price,
          discount,
          netAmount,
          profit,
        });
        await changeRepairStatus(Number(bill.repairNo), "Delivered");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save bill or update status");
      return;
    } finally {
      setSaving(false);
    }

    /* ---------- PDF generation (new layout) ---------- */
    const doc = new jsPDF({ unit: "pt" });

    // Header
    doc.setFontSize(18).setFont("helvetica", "bold");
    doc.text("SR Mobile & Music", 40, 50);

    doc.setFontSize(11).setFont("helvetica", "normal");
    doc.text("123,  Colombo Road, Minuwangoda • 077-5833-088", 40, 68);

    // Coloured bar
    doc.setDrawColor("#0ea5e9");
    doc.setFillColor("#0ea5e9");
    doc.rect(40, 85, 515, 22, "F");
    doc.setFontSize(12).setFont("helvetica", "bold").setTextColor("#ffffff");
    doc.text(type === "ITEM" ? "ITEM BILL" : "REPAIR BILL", 48, 100);
    doc.text(new Date().toLocaleDateString("en-GB"), 530, 100, {
      align: "right",
    });
    doc.setTextColor("#000000");

    // Body rows
    const rows = [
      ...(type === "ITEM"
        ? [
            ["Item No", bill.itemNo],
            ["Item Name", bill.itemName],
          ]
        : [
            ["Repair No", bill.repairNo],
            ["Device", bill.deviceName],
          ]),
      ["Price (Rs)", price.toLocaleString("en-LK")],
      ["Discount (Rs)", discount.toLocaleString("en-LK")],
      ["Net Amount (Rs)", netAmount.toLocaleString("en-LK")],
      ["Salesman ID", bill.salesman],
      ["Customer ID", bill.custId],
      ["Customer Name", bill.custName],
      ["Address", bill.address],
      ["Mobile", bill.mobile],
      ["NIC", bill.nic],
    ];

    let y = 125;
    rows.forEach(([label, val]) => {
      doc.setFont("helvetica", "bold").text(`${label}:`, 40, y);
      doc.setFont("helvetica", "normal").text(String(val), 160, y);
      y += 22;
    });

    // Footer
    doc.setDrawColor("#d1d5db");
    doc.line(40, y + 6, 555, y + 6);
    doc.setFontSize(10);
    doc.text(`Generated on ${new Date().toLocaleString()}`, 40, y + 20);

    doc.save(
      type === "ITEM"
        ? `item_${bill.itemNo || "new"}.pdf`
        : `repair_${bill.repairNo || "new"}.pdf`
    );

    resetForm();
  }

  /* ---------- UI ---------- */
  return (
    <section className="flex flex-col items-center gap-6">
      <h1 className="text-2xl font-extrabold tracking-wide">NEW BILL</h1>

      {/* Toggle */}
      <div className="flex gap-2">
        {["ITEM", "REPAIR"].map((t) => (
          <button
            key={t}
            onClick={() => {
              setType(t);
              resetForm();
            }}
            className={`rounded-full px-4 py-1 text-sm font-semibold ${
              type === t ? "bg-sky-600 text-white" : "bg-sky-100 text-sky-700"
            }`}
          >
            {t === "ITEM" ? "Item Bill" : "Repair Bill"}
          </button>
        ))}
      </div>

      {/* Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleGenerate();
        }}
        className="grid w-full max-w-xl grid-cols-1 gap-4 md:grid-cols-2"
      >
        {type === "ITEM" ? (
          <>
            <InputWithReload
              label="Item No"
              name="itemNo"
              value={bill.itemNo}
              onChange={handleChange}
              onReload={handleFetchItem}
              required
            />
            <Input
              label="Item Name"
              name="itemName"
              value={bill.itemName}
              onChange={handleChange}
              required
            />
          </>
        ) : (
          <>
            <InputWithReload
              label="Repair No"
              name="repairNo"
              value={bill.repairNo}
              onChange={handleChange}
              onReload={handleFetchRepair}
              required
            />
            <Input
              label="Device"
              name="deviceName"
              value={bill.deviceName}
              onChange={handleChange}
              required
            />
          </>
        )}

        {/* Common */}
        <Input
          label="Price (Rs)"
          name="price"
          type="number"
          min="0"
          value={bill.price}
          onChange={handleChange}
          required
        />
        <Input
          label="Discount (Rs)"
          name="discount"
          type="number"
          min="0"
          value={bill.discount}
          onChange={handleChange}
        />
        <Input
          label="Salesman ID"
          name="salesman"
          value={bill.salesman}
          onChange={handleChange}
          required
        />
        <Input label="Net Amount (Rs)" value={calcNet()} readOnly />

        {/* Customer */}
        <InputWithReload
          label="Customer ID"
          name="custId"
          value={bill.custId}
          onChange={handleChange}
          onReload={handleFetchCustomer}
          required
        />
        <InputWithReload
          label="Mobile No"
          name="mobile"
          value={bill.mobile}
          onChange={handleChange}
          onReload={handleFetchCustomerByMobile}
          required
        />
        <Input
          label="Customer Name"
          name="custName"
          value={bill.custName}
          onChange={handleChange}
          required
        />
        <Input
          label="NIC"
          name="nic"
          value={bill.nic}
          onChange={handleChange}
        />

        {/* Address */}
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium">
            Customer Address
          </label>
          <textarea
            name="address"
            rows="2"
            value={bill.address}
            onChange={handleChange}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-sky-400"
            required
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="mt-2 w-40 rounded bg-sky-600 py-2 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-60 md:col-span-2"
        >
          {saving ? "Saving…" : "Generate Bill"}
        </button>
      </form>
    </section>
  );
}

/* ---------- reusable inputs ---------- */
function Input({ label, type = "text", ...props }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <input
        type={type}
        {...props}
        className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-sky-400"
      />
    </div>
  );
}

function InputWithReload({ onReload, ...rest }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{rest.label}</label>
      <div className="flex">
        <input
          {...rest}
          className="flex-grow rounded-l border border-gray-300 px-3 py-2 text-sm outline-sky-400"
        />
        <button
          type="button"
          onClick={onReload}
          className="flex items-center justify-center rounded-r border border-l-0 border-gray-300 bg-sky-100 px-3 hover:bg-sky-200"
        >
          <RefreshCcw size={16} />
        </button>
      </div>
    </div>
  );
}
