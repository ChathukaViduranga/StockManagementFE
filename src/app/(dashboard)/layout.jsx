"use client";

import Sidebar from "../components/Sidebar";
import { useAuth } from "../providers";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "lucide-react";

export default function DashboardLayout({ children }) {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  // Prevent hydration mismatch by not rendering until client-side
  if (!mounted) {
    return null;
  }

  // Only render the layout if authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Profile icon in top right */}
        <div className="flex justify-end items-center p-4 relative">
          <button
            className="rounded-full p-2 hover:bg-sky-100 focus:outline-none"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Open profile menu"
          >
            <User size={28} />
          </button>
          {menuOpen && (
            <div className="absolute right-4 top-14 bg-white border rounded shadow-md z-50 min-w-[120px]">
              <button
                className="block w-full text-left px-4 py-2 text-sm hover:bg-sky-100"
                onClick={() => {
                  setMenuOpen(false);
                  logout();
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
