import { getJobBySlug, getJobSlugs } from "@/app/lib/airtable";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { 
  ArrowLeft, 
  Building2, 
  MapPin, 
  Banknote, 
  Calendar,
  Briefcase 
} from "lucide-react";


export const dynamicParams = true;
export const revalidate = 60;

type Props = {
  params: Promise<{ slug: string }>;
};


export async function generateStaticParams() {
  const slugs = await getJobSlugs();
  return slugs.map((item) => ({
    slug: item.slug,
  }));
}


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobBySlug(slug);

  if (!job) {
    return { title: "Oferta nie znaleziona" };
  }

  return {
    title: `${job.fields.Title} w ${job.fields.Company}`,
    description: `Dołącz do zespołu ${job.fields.Company} w lokalizacji ${job.fields.Location}. Wynagrodzenie: ${job.fields.Salary}`,
  };
}


export default async function JobPage({ params }: Props) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);

  if (!job) {
    notFound();
  }


  const formattedDate = new Date(job.createdTime).toLocaleDateString("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="min-h-screen bg-gray-50 text-slate-900 dark:bg-zinc-950 dark:text-zinc-100 py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        

        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-zinc-100 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Wróć do ofert
          </Link>
        </div>


        <header className="mb-10 border-b border-gray-200 dark:border-zinc-800 pb-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
   
            {job.fields.Status === 'Draft' && (
              <span className="inline-flex items-center rounded-md bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                Szkic
              </span>
            )}
            <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-400/30">
              {job.fields.Location}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" /> {formattedDate}
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-50 sm:text-4xl mb-6">
            {job.fields.Title}
          </h1>


          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm">
                <Building2 className="h-5 w-5 text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-500">Firma</p>
                <p className="font-medium">{job.fields.Company}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm">
                <MapPin className="h-5 w-5 text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-500">Lokalizacja</p>
                <p className="font-medium">{job.fields.Location}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm">
                <Banknote className="h-5 w-5 text-green-600 dark:text-green-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-500">Wynagrodzenie</p>
                <p className="font-medium">{job.fields.Salary}</p>
              </div>
            </div>
          </div>
        </header>

        <article className="prose prose-slate max-w-none dark:prose-invert prose-headings:font-semibold prose-a:text-blue-600 dark:prose-a:text-blue-400">

           <div className="whitespace-pre-wrap leading-relaxed text-gray-700 dark:text-gray-300">
              {job.fields.Description}
           </div>
        </article>


        <div className="mt-16 border-t border-gray-200 dark:border-zinc-800 pt-10">
          <div className="rounded-2xl bg-slate-900 dark:bg-zinc-900 p-8 text-center sm:text-left sm:flex sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Zainteresowany tą ofertą?</h3>
              <p className="mt-2 text-slate-400 text-sm max-w-md">
                Nie zwlekaj. Jeśli Twoje umiejętności pasują do opisu, chcielibyśmy Cię poznać.
              </p>
            </div>
            <div className="mt-6 sm:mt-0">
              <button className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900 transition-all shadow-lg">
                <Briefcase className="mr-2 h-4 w-4" />
                Aplikuj teraz
              </button>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}