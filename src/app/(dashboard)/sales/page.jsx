"use client";

import DailySalesChart from "@/app/components/DailySalesChart";
import { useAuth } from "../../providers";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { role } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (role !== "admin") {
      router.replace("/items");
    }
  }, [role, router]);
  if (role !== "admin") return null;

  return (
    <section className="flex flex-col gap-4">
      {/* heading */}
      <h1 className="text-2xl font-extrabold tracking-wide">DAILY SALES</h1>

      {/* card */}
      <div className=" bg-white  p-6">
        <DailySalesChart />
      </div>
    </section>
  );
}
