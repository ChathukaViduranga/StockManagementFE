"use client";

import { useState } from "react";
import Image from "next/image";
import { createItem } from "@/utils/ItemService";

export default function AddItemPage() {
  const [form, setForm] = useState({
    name: "",
    sellingPrice: "",
    cost: "",
    description: "",
    file: null,
    preview: "",
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  /* ─────────── handlers ─────────── */
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

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.file) {
      alert("Please choose an image");
      return;
    }
    try {
      setSaving(true);

      /* 1️⃣  upload image to /public/images */
      const fd = new FormData();
      fd.append("file", form.file);
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });
      if (!uploadRes.ok) throw new Error("Image upload failed");
      const { path } = await uploadRes.json(); // e.g. "/images/iphone16pro.jpg"

      /* 2️⃣  send item JSON to Spring */
      await createItem({
        name: form.name,
        sellingPrice: Number(form.sellingPrice),
        cost: Number(form.cost),
        description: form.description,
        imagePath: path, // <-------
      });
      setToast("Item saved ✔");

      /* reset */
      URL.revokeObjectURL(form.preview);
      setForm({
        name: "",
        sellingPrice: "",
        cost: "",
        description: "",
        file: null,
        preview: "",
      });
    } catch (err) {
      console.error(err);
      setToast("Failed to save item");
    } finally {
      setSaving(false);
      setTimeout(() => setToast(""), 2500);
    }
  }

  /* ─────────── UI ─────────── */
  return (
    <section className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4">
      <h1 className="mb-6 text-2xl font-extrabold tracking-wide text-center">
        ADD ITEM
      </h1>

      <div className="w-full max-w-2xl rounded-lg border border-sky-200 bg-white p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Input
            label="Item Name*"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. iPhone 16 Pro"
            required
          />

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Selling Price (Rs)*"
              name="sellingPrice"
              type="number"
              min="0"
              value={form.sellingPrice}
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

          <div>
            <label className="mb-1 block text-sm font-medium">
              Description
            </label>
            <textarea
              name="description"
              rows="3"
              value={form.description}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-sky-400"
              placeholder="Short details about the item"
            />
          </div>

          {/* image file */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium">Item Image*</label>
            <input
              name="file"
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="block text-sm file:mr-4
                         file:rounded-md file:border-0
                         file:bg-sky-600 file:px-4 file:py-2
                         file:text-sm file:font-semibold file:text-white
                         hover:file:bg-sky-700"
              required
            />
            {form.preview && (
              <div className="relative h-40 w-40">
                <Image
                  src={form.preview}
                  alt="Preview"
                  fill
                  className="rounded border object-contain"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="self-start rounded bg-[#0d1a38] px-6 py-2 text-sm
                       font-semibold tracking-wide text-white hover:opacity-90
                       disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save Item"}
          </button>
        </form>
        {toast && (
          <p className="mt-4 text-sm font-medium text-green-700">{toast}</p>
        )}
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
