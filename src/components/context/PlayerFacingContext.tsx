import { createContext, useContext } from 'react'

export type PlayerFacingContextType = {
  setPlayerFacing: (value: boolean) => void
}

export const PlayerFacingContext = createContext<PlayerFacingContextType>({
  setPlayerFacing: () => {},
})

/**
 * Context provided by PlayerFacingScreen to its children.
 * Allows children to request a "return device to Storyteller" interstitial
 * before the actual completion callback fires.
 *
 * A missing provider is an integration error; never bypass protected handback.
 */
export type HandbackContextType = {
  requestHandback: (callback: () => void) => void
}

export const HandbackContext = createContext<HandbackContextType | null>(null)

export function useHandback() {
  const context = useContext(HandbackContext)
  if (!context) throw new Error('Private handback requires PlayerFacingScreen')
  return context
}
