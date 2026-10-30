/** Presentation only; character counts and validation are unchanged. */
export function formatRoleQuantity(name: string, count: number): string {
  return count > 1 ? `${name} ×${count}` : name
}
