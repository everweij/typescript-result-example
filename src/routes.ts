import { Router, Request } from "express";
import { assertUnreachable } from "typescript-result";
import { getJobListings } from "./job-listing/list-job-listings.query.js";
import { getAuthenticatedUser } from "./auth/auth.service.js";
import { createJobListing } from "./job-listing/create-job-listing.command.js";
import { updateJobListing } from "./job-listing/update-job-listing.command.js";
import { usersRepository } from "./user/user.repository.js";

export const routes = Router();

routes.get("/users", async (_, res) => {
  const users = await usersRepository.getAll();
  res.json(users);
});

routes.get("/job-listings", async (_, res) => {
  const jobListings = await getJobListings();
  res.json(jobListings);
});

interface JobListingBody {
  title: string;
  description: string;
  images: string[];
}

routes.post(
  "/job-listings",
  async (req: Request<{}, {}, JobListingBody, { token: string }>, res) => {
    try {
      await getAuthenticatedUser(req.query.token)
        .map((user) => createJobListing({ userId: user.id, ...req.body }))
        .onSuccess((jobListing) => res.json(jobListing))
        .onFailure((error) => {
          switch (error.type) {
            case "invariant-error":
              return res.status(400).json({ message: error.message });
            case "validation-error":
              return res.status(400).json({ message: error.message });
            case "not-authorized-error":
              return res.status(401).send();
            default:
              assertUnreachable(error);
          }
        });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal server error");
    }
  }
);

routes.put(
  "/job-listings/:id",
  async (
    req: Request<{ id: string }, {}, JobListingBody, { token: string }>,
    res
  ) => {
    try {
      const id = Number(req.params.id);

      await getAuthenticatedUser(req.query.token)
        .map((user) => updateJobListing({ id, userId: user.id, ...req.body }))
        .onSuccess((jobListing) => res.json(jobListing))
        .onFailure((error) => {
          switch (error.type) {
            case "invariant-error":
              return res.status(400).json({ message: error.message });
            case "validation-error":
              return res.status(400).json({ message: error.message });
            case "not-authorized-error":
              return res.status(401).send(error.message);
            case "not-found-error":
              return res.status(404).send(error.message);
            default:
              assertUnreachable(error);
          }
        });
    } catch (error) {
      console.error(error);
      res.status(500).send();
    }
  }
);
