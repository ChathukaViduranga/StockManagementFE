"use client";

import { useState } from "react";
import { jsPDF } from "jspdf";

export default function NewBillPage() {
  const [bill, setBill] = useState({
    itemNo: "",
    itemName: "",
    price: "",
    discount: "",
    net: "",
    salesman: "", // ← NEW
    custId: "",
    custName: "",
    address: "",
    mobile: "",
    nic: "",
  });

  /* ---------------- helpers ---------------- */
  function handleChange(e) {
    const { name, value } = e.target;
    setBill({ ...bill, [name]: value });
  }

  function calcNet() {
    const p = parseFloat(bill.price) || 0;
    const d = parseFloat(bill.discount) || 0;
    return (p - d).toFixed(2);
  }

  /* ---------------- generate PDF ---------------- */
  function handleGenerate() {
    const doc = new jsPDF({ unit: "pt" });

    // title
    doc.setFontSize(16).setFont("helvetica", "bold");
    doc.text("SR Mobile & Music – Invoice / Bill", 40, 50);

    // rows
    doc.setFontSize(12).setFont("helvetica", "normal");
    const startY = 90;
    const rowGap = 50;
    const rows = [
      ["Item No", bill.itemNo],
      ["Item Name", bill.itemName],
      ["Price (Rs)", bill.price],
      ["Discount (Rs)", bill.discount],
      ["Net Amount (Rs)", calcNet()],
      ["Salesman ID", bill.salesman], // ← NEW
      ["Customer ID", bill.custId],
      ["Customer Name", bill.custName],
      ["Address", bill.address],
      ["Mobile", bill.mobile],
      ["NIC", bill.nic],
    ];

    rows.forEach(([label, value], i) => {
      const y = startY + i * rowGap;
      doc.text(`${label}:`, 40, y);
      doc.text(`${value}`, 200, y);
    });

    // footer
    doc.setFontSize(10);
    doc.text(
      `Generated on ${new Date().toLocaleString()}`,
      40,
      startY + rows.length * rowGap + 30
    );

    // download
    doc.save(`bill_${bill.itemNo || "new"}.pdf`);

    // reset form
    setBill({
      itemNo: "",
      itemName: "",
      price: "",
      discount: "",
      net: "",
      salesman: "",
      custId: "",
      custName: "",
      address: "",
      mobile: "",
      nic: "",
    });
  }

  /* ---------------- UI ---------------- */
  return (
    <section className="flex flex-col items-center gap-6">
      <h1 className="text-2xl font-extrabold tracking-wide">NEW BILL</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleGenerate();
        }}
        className="grid w-full max-w-xl grid-cols-1 gap-4 md:grid-cols-2"
      >
        {/* Item details */}
        <Input
          label="Item No"
          name="itemNo"
          value={bill.itemNo}
          onChange={handleChange}
        />
        <Input
          label="Item Name"
          name="itemName"
          value={bill.itemName}
          onChange={handleChange}
        />

        <Input
          label="Price (Rs)"
          name="price"
          type="number"
          value={bill.price}
          onChange={(e) => {
            handleChange(e);
            setBill((b) => ({ ...b, net: calcNet() }));
          }}
        />
        <Input
          label="Discount (Rs)"
          name="discount"
          type="number"
          value={bill.discount}
          onChange={(e) => {
            handleChange(e);
            setBill((b) => ({ ...b, net: calcNet() }));
          }}
        />

        {/* NEW Salesman ID */}
        <Input
          label="Salesman ID"
          name="salesman"
          value={bill.salesman}
          onChange={handleChange}
        />

        {/* Net amount (read-only) */}
        <Input label="Net Amount (Rs)" name="net" value={calcNet()} readOnly />

        {/* Customer info */}
        <Input
          label="Customer ID"
          name="custId"
          value={bill.custId}
          onChange={handleChange}
        />
        <Input
          label="Customer Name"
          name="custName"
          value={bill.custName}
          onChange={handleChange}
        />
        <Input
          label="Mobile No"
          name="mobile"
          value={bill.mobile}
          onChange={handleChange}
        />
        <Input
          label="NIC"
          name="nic"
          value={bill.nic}
          onChange={handleChange}
        />

        {/* Address (full width) */}
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium">
            Customer Address
          </label>
          <textarea
            name="address"
            rows="2"
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-sky-400"
            value={bill.address}
            onChange={handleChange}
          />
        </div>

        {/* Generate button */}
        <button
          type="submit"
          className="mt-2 w-40 rounded bg-sky-600 py-2 text-sm font-semibold text-white hover:bg-sky-700 md:col-span-2"
        >
          Generate Bill
        </button>
      </form>
    </section>
  );
}

/* -------- reusable input component -------- */
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
