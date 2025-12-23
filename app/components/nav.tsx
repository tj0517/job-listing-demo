
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Briefcase, Menu, X } from "lucide-react";
import { useState } from "react";
import { JOB_LOCATIONS } from "@/app/lib/variables";

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        <Link href="/" className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900">
            <Briefcase className="h-5 w-5" />
          </div>
          <span className="hidden sm:inline-block">JobBoard</span>
        </Link>


        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300">
            Wszystkie Oferty
          </Link>

          <div className="group relative py-4">
            <button className="flex items-center gap-1.5 text-sm font-medium text-gray-600 transition-colors group-hover:text-blue-600 dark:text-gray-300 dark:group-hover:text-blue-400">
              Lokalizacja
              <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
            </button>

            <div className="absolute right-0 top-full hidden w-48 pt-2 group-hover:block">
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl ring-1 ring-black/5 dark:border-zinc-800 dark:bg-zinc-900 dark:ring-white/10">
                <div className="p-1 flex flex-col">

                  {JOB_LOCATIONS.map((city) => (
                    <Link
                      key={city}
                      href={`/city/${encodeURIComponent(city)}`} 
                      className="block rounded-lg px-4 py-2.5 text-sm text-left text-gray-700 hover:bg-gray-50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-zinc-800 dark:hover:text-blue-400 transition-colors"
                    >
                      {city}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}