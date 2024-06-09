import { Result } from "typescript-result";
import { jobListingsRepository } from "./job-listing.repository.js";
import { NotAuthorizedError } from "../errors.js";
import { createJobListingDto } from "./job-listing.dto.js";
import { UserId } from "../user/user.domain.js";

export interface UpdateJobListingPayload {
  userId: UserId;
  id: number;
  title: string;
  description: string;
  images: string[];
}

export function updateJobListing({
  id,
  userId,
  title,
  description,
  images,
}: UpdateJobListingPayload) {
  return Result.fromAsync(jobListingsRepository.findById(id)).map(
    (jobListing) => {
      if (!jobListing.isUserAllowedToEdit(userId)) {
        return Result.error(
          new NotAuthorizedError("User is not allowed to edit this job listing")
        );
      }

      return jobListing
        .setTitle(title)
        .map((jobListing) => jobListing.setDescription(description))
        .map((jobListing) => jobListing.replaceImages(images))
        .map(createJobListingDto);
    }
  );
}
