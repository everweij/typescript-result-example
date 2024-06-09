import { Result } from "typescript-result";
import { NotFoundError } from "./errors.js";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export abstract class Repository<T extends { id: number }> {
  public abstract readonly entityName: string;

  protected abstract items: T[];

  async findById(id: number) {
    await sleep(250);

    const result = this.items.find((item) => item.id === id);
    if (!result) {
      return Result.error(
        new NotFoundError(`Could not find ${this.entityName} with id ${id}`)
      );
    }

    return Result.ok(result);
  }

  async getAll() {
    await sleep(250);

    return Promise.resolve(this.items);
  }

  async save(itemToSave: T) {
    await sleep(250);

    const shouldUpdate = this.items.some((item) => itemToSave.id === item.id);
    if (shouldUpdate) {
      this.items = this.items.map((item) =>
        itemToSave.id === item.id ? itemToSave : item
      );
    } else {
      this.items.push(itemToSave);
    }
  }
}
