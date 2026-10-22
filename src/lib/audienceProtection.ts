import { GameStorageError } from './storage'

// Global device handback latch: no game IDs, player IDs or private information.
// Any non-null value is protected, including an unrecognized/corrupt marker.
const KEY = 'grimoire_audience_protected'

export function isAudienceProtected(): boolean {
  try {
    return localStorage.getItem(KEY) !== null
  } catch {
    throw new GameStorageError('read')
  }
}

export function protectAudience(): void {
  try {
    localStorage.setItem(KEY, '1')
    if (localStorage.getItem(KEY) !== '1') throw new Error('Unverified latch')
  } catch {
    // No automatic write retry: showing information requires a fresh verified guard.
    throw new GameStorageError('write')
  }
}

/** Only call after the shared protected hold has completed. */
export function releaseAudience(): void {
  try {
    localStorage.removeItem(KEY)
    if (localStorage.getItem(KEY) !== null)
      throw new Error('Unverified release')
  } catch {
    // Never provide a retry callback that could release without another hold.
    throw new GameStorageError('write')
  }
}
