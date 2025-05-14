import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-sky-100 px-4">
      {/* headline pinned to upper‑left */}
      <h1 className="absolute top-12 left-16 z-50 text-4xl md:text-6xl font-bold">
        SR Mobile & Music
      </h1>

      <div className="relative w-full h-screen">
        {/* hero illustration */}
        <Image
          src="/assets/landing.png"
          alt="SR Mobile & Music banner"
          fill
          className="object-cover select-none"
          priority
        />

        {/* login button – give it a z‑index */}
        <Link
          href="/login"
          className="absolute left-16 top-1/2 -translate-y-1/2
                     rounded-lg bg-white/95 px-8 py-3 text-lg font-semibold
                     text-slate-800 shadow hover:bg-white focus-visible:outline
                     z-50"
        >
          Login
        </Link>
      </div>
    </main>
  );
}
