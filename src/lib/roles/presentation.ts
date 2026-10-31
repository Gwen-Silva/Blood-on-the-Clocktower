import type { RoleId } from './types'
import { getRoleLines } from '../i18n/registry'
import type { Language } from '../i18n/types'

/** Editorial selection, reviewed against each complete primary ability in all
 * three languages. Indices refer to stable, localized role-line definitions.
 * Repeated timing/effects are excluded; clarifications and victory context stay.
 * This is display metadata only, never character mechanics or save data. */
export const ROLE_SUPPLEMENTARY_LINES: Readonly<
  Record<RoleId, readonly number[]>
> = {
  imp: [2, 3],
  baron: [2, 3],
  butler: [2, 3],
  chef: [1, 2],
  drunk: [1, 3],
  empath: [1, 2],
  fortune_teller: [2],
  investigator: [1],
  librarian: [1],
  mayor: [2],
  monk: [3],
  poisoner: [1, 2, 3],
  ravenkeeper: [2],
  recluse: [2],
  saint: [1, 2],
  scarlet_woman: [1, 2],
  slayer: [1, 2, 3],
  soldier: [2],
  spy: [1, 3],
  undertaker: [1, 2],
  virgin: [1, 2, 3],
  washerwoman: [1],
  villager: [1, 2],
}

export function getRoleSupplementaryLines(roleId: RoleId, language: Language) {
  const lines = getRoleLines(roleId, language)
  return ROLE_SUPPLEMENTARY_LINES[roleId].map((index) => lines[index])
}
