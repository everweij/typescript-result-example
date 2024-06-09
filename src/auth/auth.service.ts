import { Result } from "typescript-result";
import { NotAuthorizedError } from "../errors.js";
import { usersRepository } from "../user/user.repository.js";

function getUserIdFromToken(token?: string) {
  if (!token || !token.startsWith("user-")) {
    return Result.error(new NotAuthorizedError("Invalid token"));
  }

  const id = Number(token.replace("user-", ""));
  if (Number.isNaN(id)) {
    return Result.error(new NotAuthorizedError("Invalid token"));
  }

  return Result.ok(id);
}

export function getAuthenticatedUser(token?: string) {
  return getUserIdFromToken(token)
    .map((userId) => usersRepository.findById(userId))
    .recover(() => Result.error(new NotAuthorizedError("Invalid user")));
}
