export function notNull<T>(val: T | null): T {
  if (val === null) {
    throw new Error('Invariant null value');
  }
  return val;
}
