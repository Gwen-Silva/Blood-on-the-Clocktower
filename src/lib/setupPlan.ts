import { getRole } from './roles'
import { SetupPlayer } from './roleAssignment'
import {
  SCRIPTS,
  ScriptId,
  MIN_BASE_PLAYERS,
  MAX_BASE_PLAYERS,
  getRecommendedDistribution,
  applyDistributionModifiers,
} from './scripts'
import { TeamId } from './teams'
import { RoleId } from './roles/types'

export type SetupPlan = {
  players: SetupPlayer[]
  scriptId: ScriptId
  selectedRoles: string[]
  manualAssignments: Record<string, string | null>
}

/** Keep only assignments still supported by the pool, by stable seat identity. */
export function compatibleAssignments(
  plan: SetupPlan,
): SetupPlan['manualAssignments'] {
  const remaining = new Map<string, number>()
  for (const role of plan.selectedRoles)
    remaining.set(role, (remaining.get(role) ?? 0) + 1)
  return Object.fromEntries(
    plan.players.map(({ id }) => {
      const role = plan.manualAssignments[id]
      if (role && (remaining.get(role) ?? 0) > 0) {
        remaining.set(role, remaining.get(role)! - 1)
        return [id, role]
      }
      return [id, null]
    }),
  )
}

/** Validation never resolves assignments or consumes randomness. */
export function validateSetupPlan(plan: SetupPlan): void {
  const { players, scriptId, selectedRoles, manualAssignments } = plan
  const script = SCRIPTS[scriptId]
  if (
    !script ||
    players.length < MIN_BASE_PLAYERS ||
    players.length > MAX_BASE_PLAYERS
  )
    throw new Error('Invalid setup')
  const ids = new Set(players.map(({ id }) => id))
  if (
    ids.size !== players.length ||
    players.some(
      ({ id, name }) =>
        typeof id !== 'string' ||
        !id.trim() ||
        id.trim() !== id ||
        !name.trim(),
    )
  )
    throw new Error('Invalid players')
  if (
    selectedRoles.length < players.length ||
    !selectedRoles.includes('imp') ||
    selectedRoles.some(
      (id) => !getRole(id) || !script.roles.includes(id as RoleId),
    )
  )
    throw new Error('Invalid characters')
  if (Object.keys(manualAssignments).some((id) => !ids.has(id)))
    throw new Error('Unknown assignment')
  const compatible = compatibleAssignments(plan)
  if (
    players.some(({ id }) => (manualAssignments[id] ?? null) !== compatible[id])
  )
    throw new Error('Invalid assignments')
  const randomCount = players.filter(({ id }) => !manualAssignments[id]).length
  if (!randomCount && !Object.values(manualAssignments).includes('imp'))
    throw new Error('Missing Demon')
  if (script.enforceDistribution) {
    const teams: TeamId[] = ['townsfolk', 'outsider', 'minion', 'demon']
    const recommended = getRecommendedDistribution(players.length)
    const expected =
      recommended &&
      applyDistributionModifiers(
        recommended,
        selectedRoles.map((id) => getRole(id)?.distributionModifier),
      )
    if (
      !expected ||
      selectedRoles.length !== players.length ||
      new Set(selectedRoles).size !== selectedRoles.length ||
      teams.some(
        (team) =>
          selectedRoles.filter((id) => getRole(id)?.team === team).length !==
          expected[team],
      )
    )
      throw new Error('Invalid distribution')
  }
}

export function isSetupPlanValid(plan: SetupPlan): boolean {
  try {
    validateSetupPlan(plan)
    return true
  } catch {
    return false
  }
}
