import { Repository } from "../repository.js";
import { User } from "./user.domain.js";

class UsersRepository extends Repository<User> {
  public override entityName = "User";
  protected override items = [User.create("Garry"), User.create("John")];
}

export const usersRepository = new UsersRepository();
