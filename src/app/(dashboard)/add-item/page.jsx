"use client";

import { useState } from "react";
import Image from "next/image";

export default function AddItemPage() {
  const [form, setForm] = useState({
    itemNo: "",
    name: "",
    price: "",
    cost: "",
    desc: "",
    file: null,
    preview: "",
  });

  function handleChange(e) {
    const { name, value, files } = e.target;
    if (name === "file") {
      const file = files[0];
      setForm({
        ...form,
        file,
        preview: file ? URL.createObjectURL(file) : "",
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    console.table({
      "Item No": form.itemNo,
      Name: form.name,
      Price: form.price,
      Cost: form.cost,
      Description: form.desc,
      ImageFile: form.file?.name ?? "none",
    });

    alert("Item saved (see console). Resetting form.");
    URL.revokeObjectURL(form.preview);
    setForm({
      itemNo: "",
      name: "",
      price: "",
      cost: "",
      desc: "",
      file: null,
      preview: "",
    });
  }

  return (
    <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4">
      <h1 className="mb-6 text-2xl font-extrabold tracking-wide text-center">
        ADD ITEM
      </h1>

      <div className="w-full max-w-2xl rounded-lg border border-sky-200 bg-white p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* ITEM NO */}
          <Input
            label="Item No*"
            name="itemNo"
            value={form.itemNo}
            onChange={handleChange}
            placeholder="e.g. 001"
            required
          />

          {/* ITEM NAME */}
          <Input
            label="Item Name*"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. iPhone 15 Pro"
            required
          />

          {/* PRICE & COST */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="Selling Price (Rs)*"
              name="price"
              type="number"
              min="0"
              value={form.price}
              onChange={handleChange}
              required
            />
            <Input
              label="Cost (Rs)*"
              name="cost"
              type="number"
              min="0"
              value={form.cost}
              onChange={handleChange}
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Description
            </label>
            <textarea
              name="desc"
              rows="3"
              value={form.desc}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-sky-400"
              placeholder="Short details about the item"
            />
          </div>

          {/* IMAGE UPLOAD */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium">Item Image</label>
            <input
              name="file"
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="block text-sm
                         file:mr-4 file:rounded-md file:border-0
                         file:bg-sky-600 file:px-4 file:py-2
                         file:text-sm file:font-semibold file:text-white
                         hover:file:bg-sky-700"
            />

            {form.preview && (
              <div className="relative w-40 h-40">
                <Image
                  src={form.preview}
                  alt="Preview"
                  fill
                  className="object-contain border rounded"
                />
              </div>
            )}
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="self-start rounded bg-[#0d1a38] px-6 py-2 text-sm font-semibold tracking-wide text-white hover:opacity-90"
          >
            Save Item
          </button>
        </form>
      </div>
    </section>
  );
}

/* reusable text/number input */
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
