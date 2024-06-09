import { createJobListingDto } from "./job-listing.dto.js";
import { jobListingsRepository } from "./job-listing.repository.js";

export async function getJobListings() {
  const jobListings = await jobListingsRepository.getAll();
  return jobListings.map(createJobListingDto);
}
