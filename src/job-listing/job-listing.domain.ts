import { Result } from "typescript-result";
import { generateId, Brand } from "../helper.js";
import { JobApplication } from "./job-application.domain.js";
import { InvariantError, ValidationError } from "../errors.js";
import { UserId } from "../user/user.domain.js";

export type JobListingId = Brand<number, "JobListingId">;

export class JobListing {
  private constructor(
    public readonly id: JobListingId,
    public readonly createdBy: UserId,
    public editableBy: ReadonlyArray<UserId> = [],
    public applications: ReadonlyArray<JobApplication> = [],
    public title: string = "",
    public description: string = "",
    public images: string[] = []
  ) {}

  get hasApplications() {
    return this.applications.length > 0;
  }

  setTitle(title: string) {
    if (title.length < 5) {
      return Result.error(
        new ValidationError("Title must be at least 5 chars long")
      );
    }

    if (this.hasApplications) {
      return Result.error(
        new InvariantError(
          "Cannot change listing details once people have started applying"
        )
      );
    }

    this.title = title;

    return Result.ok(this);
  }

  setDescription(description: string) {
    if (description.length < 50) {
      return Result.error(
        new ValidationError("Description must be at least 50 chars long")
      );
    }

    if (description.length > 500) {
      return Result.error(
        new ValidationError("Description cannot exceed 500 chars")
      );
    }

    if (this.hasApplications) {
      return Result.error(
        new InvariantError(
          "Cannot change listing details once people have started applying"
        )
      );
    }

    this.description = description;

    return Result.ok(this);
  }

  private addImage(imageUrl: string) {
    const pattern = /\.(png|jpg|jpeg|gif)$/;
    if (!pattern.test(imageUrl)) {
      return Result.error(
        new ValidationError(`Invalid image format: ${imageUrl}`)
      );
    }

    this.images = [...this.images, imageUrl];

    return Result.ok();
  }

  replaceImages(images: string[]) {
    this.images = [];
    return Result.all(...images.map((imageUrl) => this.addImage(imageUrl))).map(
      () => this
    );
  }

  isUserAllowedToEdit(userId: UserId) {
    const isCreator = this.createdBy === userId;
    const hasPermission = this.editableBy.some((id) => userId === id);

    return isCreator || hasPermission;
  }

  static create(
    createdBy: UserId,
    title: string,
    description: string,
    images: string[]
  ) {
    const jobListing = new JobListing(generateId() as JobListingId, createdBy);

    return jobListing
      .setTitle(title)
      .map((jobListing) => jobListing.setDescription(description))
      .map((jobListing) => jobListing.replaceImages(images));
  }
}
