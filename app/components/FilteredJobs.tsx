"use client";

import { useSearchParams } from "next/navigation";
import { JobFilter } from "./filters";
import List from "./job-list";
import { Job } from "../lib/airtable";
import { useMemo, useState, useEffect } from "react";
import { PaginationControls } from "./pagination";
import { ChevronDown, Filter, X } from "lucide-react"; // Dodaj import ikony Filter i X
import dynamic from "next/dynamic";

// Dynamiczny import mapy
const JobMap = dynamic(() => import("./Jobmap"), { 
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-gray-100 dark:bg-zinc-800 rounded-xl animate-pulse flex items-center justify-center text-gray-400">
      Ładowanie mapy...
    </div>
  )
});

export default function FilteredJobBoard({ initialJobs }: { initialJobs: Job[] }) {
  const searchParams = useSearchParams();
  
  // Stan dla mobilnego menu filtrów
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // --- STANY ---
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // --- FILTRY (bez zmian) ---
  const query = searchParams.get("q")?.toLowerCase() || "";
  const cityParam = searchParams.get("city") || ""; 
  const companyParam = searchParams.get("company");
  const selectedCompanies = companyParam ? companyParam.split(";") : [];

  const uniqueLocations = useMemo(() => {
    const locations = initialJobs.map(job => job.fields.Location).filter(Boolean); 
    return Array.from(new Set(locations)).sort();
  }, [initialJobs]);

  const uniqueCompanies = useMemo(() => {
    const companies = initialJobs.map(job => job.fields.Company).filter(Boolean);
    return Array.from(new Set(companies)).sort();
  }, [initialJobs]);

  const filteredJobs = initialJobs.filter((job) => {
    const title = job.fields.Title?.toLowerCase() || "";
    const companyRaw = job.fields.Company;
    const companyName = Array.isArray(companyRaw) ? companyRaw[0]?.toString() : companyRaw?.toString();
    const companyLower = companyName?.toLowerCase() || "";
    const titleMatch = query ? title.includes(query) || companyLower.includes(query) : true;
    const cityMatch = cityParam ? job.fields.Location === cityParam : true;
    let companyMatch = true;
    if (selectedCompanies.length > 0) {
       companyMatch = selectedCompanies.includes(companyName || "");
    }
    return titleMatch && cityMatch && companyMatch;
  });

  useEffect(() => { setCurrentPage(1); }, [query, cityParam, companyParam]);

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (count: number) => {
    setItemsPerPage(count);
    setCurrentPage(1);
  };

  return (
    <div className="w-full px-4  mx-auto mt-6 relative text-white">
      
      {/* --- NAGŁÓWEK --- */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Baza Ofert
            </h2>
            
            {/* PRZYCISK FILTRÓW (Widoczny tylko poniżej LG) */}
            <button 
                onClick={() => setIsMobileFilterOpen(true)}
                className="xl:hidden flex items-center gap-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors shadow-sm"
            >
                <Filter className="w-4 h-4" />
                Filtry
            </button>
          </div>

          <span className="text-sm font-medium text-gray-500 bg-gray-100 dark:bg-zinc-800 px-3 py-1 rounded-full whitespace-nowrap">
              Znaleziono: {filteredJobs.length}
          </span>
      </div>

      {/* --- UKŁAD GŁÓWNY --- */}
      <div className="flex flex-col md:flex-row gap-6 items-start h-full">
        
        {/* 1. FILTRY DESKTOP (Ukryte na mobile/tablet, widoczne od LG) */}
        <aside className="hidden xl:block w-[280px] shrink-0 sticky top-20">
          <JobFilter 
              key={searchParams.toString()} 
              locations={uniqueLocations} 
              companies={uniqueCompanies} 
          />
        </aside>

        {/* 2. LISTA */}
        <div className="w-full xl:flex-1 flex flex-col min-w-0">
          <List jobs={paginatedJobs} />

          {/* Stopka paginacji */}
          {filteredJobs.length > 0 && (
            <div className="flex flex-col gap-4 mt-8 pt-6 border-t border-gray-100 dark:border-zinc-800 dark:bg-black pb-4">
              <div className="flex items-center justify-center sm:justify-between w-full">
             
                <PaginationControls 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
              </div>
            </div>
          )}
        </div>


        <div className="w-full xl:w-[35%] h-[400px] xl:h-[calc(100vh-8rem)] xl:sticky xl:top-20 rounded-xl overflow-hidden border border-gray-200 dark:border-zinc-800 shadow-sm">
           <div className="h-full w-full">
              <JobMap jobs={filteredJobs} />
           </div>
        </div>

      </div>

      {isMobileFilterOpen && (
        <div 
            className="fixed inset-0 bg-black/50 z-40 xl:hidden backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileFilterOpen(false)}
        />
      )}

      {/* Panel boczny */}
      <div className={`
          fixed inset-y-0 left-0 z-50 w-[300px] bg-white dark:bg-zinc-900 shadow-2xl transform transition-transform duration-300 ease-in-out xl:hidden border-r border-gray-200 dark:border-zinc-800 overflow-y-auto
          ${isMobileFilterOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
          <div className="p-4 flex items-center justify-between border-b border-gray-100 dark:border-zinc-800">
              <h3 className="font-bold text-lg">Filtry</h3>
              <button 
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
              >
                  <X className="w-5 h-5 text-gray-500" />
              </button>
          </div>
          <div className="p-4">
              {/* Tutaj renderujemy filtry ponownie wewnątrz panelu */}
              <JobFilter 
                  key={`mobile-${searchParams.toString()}`} 
                  locations={uniqueLocations} 
                  companies={uniqueCompanies} 
              />
               <button 
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full mt-6 bg-black text-white py-3 rounded-lg font-bold text-sm"
               >
                   Pokaż {filteredJobs.length} ofert
               </button>
          </div>
      </div>

    </div>
  );
}