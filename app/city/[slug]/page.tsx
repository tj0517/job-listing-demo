import { getJobsByLocation, getJobSlugs } from "@/app/lib/airtable";
import { notFound } from "next/navigation";
import { JOB_LOCATIONS } from "@/app/lib/variables";
import List from "@/app/components/job-list"; 
import { Metadata } from "next";


export async function generateStaticParams() {
  return JOB_LOCATIONS.map((city) => ({
    slug: city.toLowerCase(),
  }));
}



export const dynamicParams = true; 


type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
    const city = decodeURIComponent(slug);

  if (!city) {
    return { title: "Oferta nie znaleziona" };
  }

  return {
    title: `${city}`,
    description: `Znajdz oferty pracy w ${city}, zobacz dostępne stanowiska i aplikuj już dziś!`,
  };
}

export default async function CityPage({ params }: Props) {
  const { slug } = await params;
    const decodedCity = decodeURIComponent(slug);

  const cityJobs = await getJobsByLocation(decodedCity);

  return (
    <main>
        <List jobs_active={cityJobs} />
    </main>
  );
}