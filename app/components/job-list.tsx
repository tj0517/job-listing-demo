import Link from "next/link"
 
 
 export default async function List({ jobs_active }: { jobs_active: any[] }) {
    return  (
 <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4">
          
          {jobs_active.map((job: any) => (
            // Używamy Link, aby cała karta była klikalna (UX)
            <Link 
              href={`/jobs/${job.fields.Slug || '#'}`} 
              key={job.id}
              className="group block"
            >
              <article className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-blue-500 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-600">
                
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  {/* Lewa strona: Treść */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between sm:hidden mb-2">
                       {/* Mobile Status Badge */}
                       <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-900/30 dark:text-green-400">
                          Active
                        </span>
                    </div>

                    <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400 transition-colors">
                      {job.fields.Title}
                    </h2>
                    <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                      {job.fields.Company}
                    </p>

                    {/* Tagi / Metadane */}
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-1.5 rounded-md bg-gray-100 px-2.5 py-1.5 text-sm font-medium text-gray-700 dark:bg-zinc-800 dark:text-gray-300">
                        <span>📍</span>
                        {job.fields.Location}
                      </div>
                      <div className="flex items-center gap-1.5 rounded-md bg-blue-50 px-2.5 py-1.5 text-sm font-medium text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                        <span>💰</span>
                        {job.fields.Salary}
                      </div>
                    </div>
                  </div>

                  {/* Prawa strona: Desktop Status + Button */}
                  <div className="flex flex-col items-end gap-4">
                    <span className="hidden sm:inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-900/30 dark:text-green-400">
                      Active
                    </span>
                    
                    {/* Fake Button dla Call to Action */}
                    <div className="mt-2 hidden sm:block rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-700 dark:bg-white dark:text-black dark:hover:bg-gray-200">
                      Zobacz ofertę &rarr;
                    </div>
                  </div>
                </div>
                
                {/* Opis skrócony (opcjonalnie) */}
                <p className="mt-4 text-sm text-gray-600 line-clamp-2 dark:text-gray-400">
                    {job.fields.Description}
                </p>
     

              </article>
            </Link>
          ))}
        
        </div>
      </div>
 )}