import { Brand, generateId } from "../helper.js";

export type UserId = Brand<number, "UserId">;

export class User {
  private constructor(
    public readonly id: UserId,
    public readonly name: string
  ) {}

  static create(name: string) {
    return new User(generateId() as UserId, name);
  }
}
