import { useState, type ReactNode } from 'react'
import {
  isAudienceProtected,
  releaseAudience,
} from '../../lib/audienceProtection'
import { ReturnDeviceScreen } from './ReturnDeviceScreen'

/** A fresh mount/route must pass handback before mounting any privileged UI. */
export function AudienceRecoveryBoundary({
  children,
}: {
  children: ReactNode
}) {
  const [locked, setLocked] = useState(isAudienceProtected)
  const [error, setError] = useState<unknown>(null)
  if (error) throw error
  if (!locked) return children
  return (
    <ReturnDeviceScreen
      onReady={() => {
        try {
          releaseAudience()
          setLocked(false)
        } catch (failure) {
          setError(failure)
        }
      }}
    />
  )
}
