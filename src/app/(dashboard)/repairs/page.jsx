import RepairsGrid from "@/app/components/RepairsGrid";

export const metadata = { title: "Repairs" };

export default function RepairsPage() {
  return (
    <section className="flex flex-col gap-4 bg-white">
      {/* heading + action */}
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold tracking-wide">Repairs</h1>
      </header>

      {/* the DataGrid card */}
      <div className="rounded-lg border border-sky-200 bg-white shadow-sm">
        <RepairsGrid />
      </div>
    </section>
  );
}
