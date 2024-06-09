import { JobListing } from "./job-listing.domain.js";

export interface JobListingDto {
  id: number;
  title: string;
  description: string;
  images: string[];
}

export function createJobListingDto(jobListing: JobListing): JobListingDto {
  return {
    id: jobListing.id,
    title: jobListing.title,
    description: jobListing.description,
    images: jobListing.images,
  };
}
