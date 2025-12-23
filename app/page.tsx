import Image from "next/image";
import Link from "next/link"; // Dodane do obsługi linków
import {  getActiveJobs } from "./lib/airtable";
import List from "./components/job-list";

export const revalidate = 60; 

export default async function Home() {

  const jobs_active = await getActiveJobs();

  return (
    <main className="min-h-screen bg-gray-50 text-slate-900 dark:bg-zinc-950 dark:text-zinc-100">

      <header className="bg-white shadow-sm dark:bg-zinc-900">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Aktualne Oferty Pracy
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Znajdź najlepsze zlecenia dla kierowców i w logistyce.
          </p>
        </div>
      </header>


     <List jobs_active={jobs_active} />
    </main>
  );
}
