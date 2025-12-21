import { unstable_cache } from "next/cache";
import { JobLocation } from "./variables";

export interface Job {
    id: string;
    fields: {
        Title: string;
        Company: string;
        Slug: string;
        Location: JobLocation;
        Salary: string;
        Description: string;
        Status: 'Active' | 'Draft';
    };
    createdTime: string;
}

interface JobsResponse {
    records: Job[];
    offset?: string;
}

const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_TABLE_NAME = 'Jobs';
const AIRTABLE_API_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`;


const fetchRawJobs = async (): Promise<Job[]> => {
    const response = await fetch(AIRTABLE_API_URL, {
        headers: {
            Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        },
        cache: 'no-store' 
    });

    if (!response.ok) {
        throw new Error('Failed to fetch jobs from Airtable');
    }

    const data: JobsResponse = await response.json();
    return data.records;
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