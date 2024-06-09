import { UserId } from "../user/user.domain.js";

export class JobApplication {
  constructor(public readonly userId: UserId) {}
}
