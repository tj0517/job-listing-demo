import { getActiveJobs } from "./lib/airtable";
import FilteredJobBoard from "./components/FilteredJobs";
import { Suspense } from "react";

export const revalidate = 60;


export default async function HomePage() {
  // 1. Pobieramy wszystkie aktywne oferty (Server Side)
  const jobs = await getActiveJobs();

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-black">
      <div className="mx-auto px-4 py-12 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Znajdź pracę w transporcie
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Przeglądaj aktualne oferty z całej Polski.
          </p>
        </div>

        {/* 2. Przekazujemy dane do Client Componentu, który zajmie się resztą */}
        <Suspense fallback={<LoadingState />}>
        <FilteredJobBoard initialJobs={jobs} />
      </Suspense>
        
      </div>
    </main>
  );
}
function LoadingState() {
  return (
    <div className="w-[95vw] mx-auto mt-6 flex gap-6">
      <div className="w-[300px] h-[500px] bg-gray-200 dark:bg-zinc-800 animate-pulse rounded-xl" />
      <div className="flex-1 h-[500px] bg-gray-200 dark:bg-zinc-800 animate-pulse rounded-xl" />
      <div className="flex-1 h-[500px] bg-gray-200 dark:bg-zinc-800 animate-pulse rounded-xl" />
    </div>
  );
}