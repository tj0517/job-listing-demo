import Link from "next/link";
import { Job } from "../lib/airtable";

// ZMIANA TUTAJ: Zmieniamy 'jobs_active' na 'jobs'
export default function List({ jobs }: { jobs: Job[] }) {
  
  // Obsługa pustej listy
  if (!jobs || jobs.length === 0) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 text-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Brak ofert spełniających kryteria.
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Spróbuj zmienić filtry.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full">
      <div className="flex flex-col gap-4">
        
        {/* ZMIANA TUTAJ: iterujemy po 'jobs' */}
        {jobs.map((job) => (
          <Link
            href={`/jobs/${job.fields.Slug || '#'}`}
            key={job.id}
            className="group block"
          >
            <article className="w-full relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-blue-500 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-600">
              
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                    {/* ... Twój kod wyświetlający treść ... */}
                    <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 dark:text-white transition-colors">
                      {job.fields.Title}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      {job.fields.Company}
                    </p>
                     
                     {/* Reszta Twojego UI (Lokalizacja, Zarobki itp.) */}
                     <div className="mt-4 flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-1.5 rounded-md bg-gray-100 px-2.5 py-1.5 text-sm text-gray-700 dark:bg-zinc-800 dark:text-gray-300">
                            {job.fields.Location}
                        </div>
                        <div className="flex items-center gap-1.5 rounded-md bg-blue-50 px-2.5 py-1.5 text-sm text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                            {job.fields.Salary}
                        </div>
                     </div>
                </div>

                {/* Przycisk */}
                <div className="mt-2 hidden sm:block rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white">
                    Zobacz &rarr;
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}