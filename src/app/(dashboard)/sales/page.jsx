import DailySalesChart from "@/app/components/DailySalesChart";

export const metadata = { title: "Daily Sales" };

export default function Page() {
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
