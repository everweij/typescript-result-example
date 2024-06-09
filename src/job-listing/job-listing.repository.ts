import { Repository } from "../repository.js";
import { JobListing } from "./job-listing.domain.js";

class JobListingsRepository extends Repository<JobListing> {
  public override entityName = "JobListing";
  protected override items: JobListing[] = [];
}

export const jobListingsRepository = new JobListingsRepository();
