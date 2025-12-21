
export const JOB_LOCATIONS = ['Warszawa', 'Kraków', 'Zdalnie'] as const;

export type JobLocation = (typeof JOB_LOCATIONS)[number];