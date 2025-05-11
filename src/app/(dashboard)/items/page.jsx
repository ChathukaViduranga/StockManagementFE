import ItemsGrid from "@/app/components/ItemsGrid";
import Link from "next/link";

export const metadata = { title: "Items Available" };

export default function ItemsPage() {
  return (
    <section className="flex flex-col gap-4 bg-white">
      {/* heading + action */}
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold tracking-wide">
          ITEMS AVAILABLE
        </h1>
        <Link
          href={"/add-item"}
          className="rounded bg-emerald-400/80 px-3 py-1 text-xs font-semibold text-white
                           shadow hover:bg-emerald-500 active:translate-y-px"
        >
          + ADD ITEM
        </Link>
      </header>

      {/* the DataGrid card */}
      <div className="rounded-lg border border-sky-200 bg-white shadow-sm">
        <ItemsGrid />
      </div>
    </section>
  );
}
