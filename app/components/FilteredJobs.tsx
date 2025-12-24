"use client";

import { useSearchParams } from "next/navigation";
import { JobFilter } from "./filters";
import List from "./job-list";
import { Job } from "../lib/airtable";
import { useMemo, useState, useEffect } from "react";
import { PaginationControls } from "./pagination";
import { ChevronDown } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamiczny import mapy (bez SSR)
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
  
  // --- STANY ---
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Zwiększyłem domyślnie na 10, lepiej wygląda w kolumnie

  // --- FILTRY ---
  const query = searchParams.get("q")?.toLowerCase() || "";
  const cityParam = searchParams.get("city") || ""; 
  const companyParam = searchParams.get("company");
  const selectedCompanies = companyParam ? companyParam.split(";") : [];

  // --- GENEROWANIE DANYCH ---
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

  // --- PAGINACJA ---
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
    // GLÓWNY KONTENER: 95vw szerokości
    <div className="w-[95vw] mx-auto mt-6">
      
      {/* NAGŁÓWEK NA GÓRZE */}
      <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Baza Ofert Pracy
          </h2>
          <span className="text-sm font-medium text-gray-500 bg-gray-100 dark:bg-zinc-800 px-3 py-1 rounded-full">
              Znaleziono: {filteredJobs.length}
          </span>
      </div>

      {/* GRID 3 KOLUMNY: FILTRY | MAPA | LISTA */}
      <div className="flex flex-row gap-6 items-start h-full">
        
        {/* KOLUMNA 1: FILTRY (Stała szerokość, Sticky) */}
        <aside className="w-[300px] shrink-0 sticky top-20">
          <JobFilter 
      key={searchParams.toString()} 
      
      locations={uniqueLocations} 
      companies={uniqueCompanies} 
  />
        </aside>

        <div className="flex-1 flex flex-col min-w-[350px]">
          
          <List jobs={paginatedJobs} />

          {/* STOPKA PAGINACJI */}
          {filteredJobs.length > 0 && (
            <div className="flex flex-col gap-4 mt-8 pt-6 border-t border-gray-100 dark:border-zinc-800 dark:bg-black pb-4">
              
              <div className="flex items-center justify-between">
                <PaginationControls 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
              </div>
            </div>
          )}
        </div>

                <div className="flex-1 sticky top-20 h-[calc(100vh*2/3)] rounded-xl overflow-hidden border border-gray-200 dark:border-zinc-800 shadow-sm">
           {/* Mapa zajmuje 100% wysokości tego kontenera */}
           <div className="h-full w-full">
              <JobMap jobs={initialJobs} />
           </div>
        </div>

      </div>
    </div>
  );
}