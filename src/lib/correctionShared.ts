/** Equality of persisted values: object key order is not semantic; array order is. */
export function sameSavedValue(a: unknown, b: unknown): boolean {
  const canonical = (value: unknown): unknown => {
    if (Array.isArray(value)) return value.map(canonical)
    if (value !== null && typeof value === 'object')
      return Object.fromEntries(
        Object.keys(value)
          .sort()
          .filter(
            (key) => (value as Record<string, unknown>)[key] !== undefined,
          )
          .map((key) => [
            key,
            canonical((value as Record<string, unknown>)[key]),
          ]),
      )
    return value
  }
  return JSON.stringify(canonical(a)) === JSON.stringify(canonical(b))
}
