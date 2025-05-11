import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-sky-100">
      {/* headline pinned to the upper‑left corner */}
      <h1 className="absolute top-12 left-16 z-50 text-6xl font-bold">
        SR Mobile & Music
      </h1>

      <div className="relative w-full h-screen">
        {/* hero illustration */}
        <Image
          src="/assets/landing.png"
          alt="SR Mobile & Music banner"
          fill={true}
          className="object-fill select-none"
          priority
        />

        {/* login button – anchored left side */}
        <Link
          href="/login"
          className="absolute left-16 top-1/2 -translate-y-1/2
                 rounded-lg bg-white/95 px-8 py-3 text-lg font-semibold
                 text-slate-800 shadow hover:bg-white"
        >
          Login
        </Link>
      </div>
    </main>
  );
}
