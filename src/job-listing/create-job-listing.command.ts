import { UserId } from "../user/user.domain.js";
import { JobListing } from "./job-listing.domain.js";
import { createJobListingDto } from "./job-listing.dto.js";
import { jobListingsRepository } from "./job-listing.repository.js";

interface CreateJobListingCommand {
  userId: UserId;
  title: string;
  description: string;
  images: string[];
}

export function createJobListing({
  userId,
  title,
  description,
  images,
}: CreateJobListingCommand) {
  return JobListing.create(userId, title, description, images)
    .onSuccess((jobListing) => jobListingsRepository.save(jobListing))
    .map(createJobListingDto);
}
