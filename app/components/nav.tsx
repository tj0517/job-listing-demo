
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Briefcase, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-stone-900/70">
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

        </div>
      </div>
    </nav>
  );
}