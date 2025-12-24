import { unstable_cache } from "next/cache";
import Airtable from "airtable"; // Importujemy SDK

export interface Job {
    id: string;
    fields: {
        Title: string;
        Company: string;
        Slug: string;
        Location: string;
        Salary: string;
        Description: string;
        Status: 'Active' | 'Draft';
    };
    createdTime: string;
}


const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID!);
const AIRTABLE_TABLE_NAME = 'Jobs';


const fetchRawJobs = async (): Promise<Job[]> => {

    const records = await base(AIRTABLE_TABLE_NAME).select({
        view: "Grid view", 
    }).all();

    return records.map((record) => ({
        id: record.id,
        fields: record.fields as Job['fields'],
        createdTime: record._rawJson.createdTime,
    }));
};


export const getCachedJobs = unstable_cache(
    async () => fetchRawJobs(),
    ['airtable-jobs-master'], 
    { 
        revalidate: 60, 
        tags: ['jobs'] 
    }
);

export const getActiveJobs = async (): Promise<Job[]> => {
    const jobs = await getCachedJobs();
    return jobs.filter(job => job.fields.Status === 'Active');
};

export const getJobBySlug = async (slug: string): Promise<Job | undefined> => {
    const jobs = await getCachedJobs();
    return jobs.find(job => job.fields.Slug === slug);
};

export const getJobSlugs = async (): Promise<{ slug: string }[]> => {
    const jobs = await getCachedJobs();
    return jobs
        .filter((job) => job.fields.Slug)
        .map(job => ({ slug: job.fields.Slug }));
};

export const getJobsByLocation = async (location: string): Promise<Job[]> => {
    const jobs = await getActiveJobs();
    const targetLocation = location.toLowerCase();
    
    return jobs.filter(job => 
        job.fields.Location?.toLowerCase() === targetLocation
    );
};