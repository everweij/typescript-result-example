let counter = 0;

export function generateId() {
  return counter++;
}

export type Brand<T, B> = T & { __brand: B };
