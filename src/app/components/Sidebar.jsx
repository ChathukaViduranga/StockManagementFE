// components/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Home,
  Package,
  DollarSign,
  ShoppingCart,
  Settings,
  UsersRound,
  Wrench,
  BookOpenCheck,
  Menu,
} from "lucide-react";
import clsx from "clsx";
import { useAuth } from "../providers";

const nav = [
  { href: "/add-item", label: "Add Items", icon: Package },
  { href: "/add-user", label: "Add User", icon: UsersRound, adminOnly: true },
  { href: "/new-bill", label: "New Bill", icon: DollarSign },
  { href: "/items", label: "Items Available", icon: Home },
  { href: "/sales", label: "Daily Sales", icon: ShoppingCart, adminOnly: true },
  { href: "/customers", label: "Customers", icon: UsersRound },
  { href: "/repairs", label: "Repairs", icon: Wrench },
  {
    href: "/accounting",
    label: "Accounting",
    icon: BookOpenCheck,
    adminOnly: true,
  },
  { href: "/expenses", label: "Expenses", icon: DollarSign, adminOnly: true },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { role } = useAuth();

  return (
    <>
      <button
        className="sm:hidden absolute top-4 left-4 z-20"
        onClick={() => setOpen(!open)}
      >
        <Menu size={22} />
      </button>
      <aside
        className={clsx(
          "w-64 shrink-0 bg-sky-100 px-4 py-6 flex flex-col",
          "transform transition-transform duration-200",
          open ? "translate-x-0" : "-translate-x-full",
          "sm:translate-x-0 sm:static"
        )}
      >
        <h1 className="mb-8 text-xl font-semibold">SR Mobile &amp; Music</h1>

        <nav className="flex-1 space-y-1">
          {nav
            .filter((item) => !(item.adminOnly && role !== "admin"))
            .map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium
                  ${
                    active
                      ? "bg-sky-300 text-gray-900"
                      : "text-gray-700 hover:bg-sky-200"
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              );
            })}
        </nav>

        <div className="mt-6 flex gap-4 pl-1">
          <a
            href="https://www.facebook.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="text-xl text-gray-700 hover:text-sky-700"
          >
            <i className="ri-facebook-line" />
          </a>

          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-xl text-gray-700 hover:text-sky-700"
          >
            <i className="ri-instagram-line" />
          </a>

          <a
            href="https://www.tiktok.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
            className="text-xl text-gray-700 hover:text-sky-700"
          >
            <i className="ri-tiktok-line" />
          </a>
        </div>
      </aside>
    </>
  );
}
