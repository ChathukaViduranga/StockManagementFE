"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  /* hard‑coded demo creds */
  const USERNAME = "admin";
  const PASSWORD = "secret123";

  const [form, setForm] = useState({ user: "", pass: "", remember: false });
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (form.user === USERNAME && form.pass === PASSWORD) {
      router.push("/items");
    } else {
      setError("Invalid credentials");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-100">
      <div className="bg-white rounded-lg shadow-md flex overflow-hidden w-[900px]">
        {/* LEFT – form */}
        <div className="w-full max-w-[45%] px-10 py-8">
          <h2 className="text-sm font-bold text-rose-600 tracking-wider">
            SR MOBILE & MUSIC
          </h2>
          <h1 className="mt-2 mb-1 text-xl font-bold">Login</h1>
          <p className="mb-6 text-sm text-gray-600">
            Seize your growth and gain support
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium">
                Username*
              </label>
              <input
                name="user"
                value={form.user}
                onChange={handleChange}
                placeholder="Enter your username"
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-sky-400"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium">
                Password*
              </label>
              <input
                type="password"
                name="pass"
                value={form.pass}
                onChange={handleChange}
                placeholder="********"
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-sky-400"
                required
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  name="remember"
                  checked={form.remember}
                  onChange={handleChange}
                  className="accent-sky-500"
                />
                Remember me
              </label>
              <button type="button" className="text-sky-600 hover:underline">
                Forgot password?
              </button>
            </div>

            {error && <p className="text-xs text-rose-600">{error}</p>}

            <button
              type="submit"
              className="w-full rounded bg-[#0d1a38] py-2 text-sm font-semibold tracking-wide text-white hover:opacity-90"
            >
              Login
            </button>
          </form>

          <p className="mt-4 text-xs">
            Not registered yet?{" "}
            <span className="text-sky-600 hover:underline cursor-pointer">
              Create a new account
            </span>
          </p>
        </div>

        {/* RIGHT – art */}
        <div className="relative flex-1 bg-sky-50">
          <Image
            src="/assets/login-art.png"
            alt="Guitar, phones and keyboard illustration"
            fill
            className="object-cover p-10"
          />
        </div>
      </div>
    </div>
  );
}
