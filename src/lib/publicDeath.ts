export type PublicDeathEntry = {
  playerId: string
  playerName: string
}

/** Explicit public allowlist. Never spread authoritative player objects. */
export function toPublicDeaths(
  players: readonly { id: string; name: string }[],
  playerIds: readonly string[],
): PublicDeathEntry[] {
  return playerIds.flatMap((id) => {
    const player = players.find((candidate) => candidate.id === id)
    return player ? [{ playerId: player.id, playerName: player.name }] : []
  })
}
