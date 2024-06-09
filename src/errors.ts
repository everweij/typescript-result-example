export class InvariantError extends Error {
  readonly type = "invariant-error";
}

export class ValidationError extends Error {
  readonly type = "validation-error";
}

export class NotAuthorizedError extends Error {
  readonly type = "not-authorized-error";
}

export class NotFoundError extends Error {
  readonly type = "not-found-error";
}
