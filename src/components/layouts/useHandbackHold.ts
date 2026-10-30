import { useCallback, useEffect, useRef, useState } from 'react'

const HOLD_MS = 1000

/** Interaction enforcement for the neutral handback screen only. */
export function useHandbackHold(onReady: () => void) {
  const [progress, setProgress] = useState(0)
  const attempt = useRef<{ input: string; started: number } | null>(null)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)
  const completed = useRef(false)
  const callback = useRef(onReady)
  callback.current = onReady

  const clearTimer = useCallback(() => {
    if (timer.current !== null) clearInterval(timer.current)
    timer.current = null
  }, [])

  const cancel = useCallback(() => {
    attempt.current = null
    clearTimer()
    if (!completed.current) setProgress(0)
  }, [clearTimer])

  const start = (input: string) => {
    if (completed.current || attempt.current || document.hidden) return
    attempt.current = { input, started: performance.now() }
    setProgress(0)
    timer.current = setInterval(() => {
      const active = attempt.current
      if (!active) return
      if (document.hidden) {
        cancel()
        return
      }
      const elapsed = performance.now() - active.started
      setProgress(Math.min(elapsed / HOLD_MS, 1))
      if (elapsed >= HOLD_MS) {
        completed.current = true
        attempt.current = null
        clearTimer()
        callback.current()
      }
    }, 20)
  }

  useEffect(() => {
    window.addEventListener('blur', cancel)
    document.addEventListener('visibilitychange', cancel)
    return () => {
      window.removeEventListener('blur', cancel)
      document.removeEventListener('visibilitychange', cancel)
      attempt.current = null
      clearTimer()
    }
  }, [cancel, clearTimer])

  return {
    progress,
    handlers: {
      onClick: (event: React.MouseEvent<HTMLButtonElement>) =>
        event.preventDefault(),
      onContextMenu: (event: React.MouseEvent<HTMLButtonElement>) => {
        // Mobile long-press menus do not mean the finger was released. Keep
        // tracking the pointer; up/cancel/capture loss still end the attempt.
        event.preventDefault()
      },
      onPointerDown: (event: React.PointerEvent<HTMLButtonElement>) => {
        if (event.button !== 0 || event.isPrimary === false) return
        event.preventDefault()
        event.currentTarget.focus({ preventScroll: true })
        event.currentTarget.setPointerCapture?.(event.pointerId)
        start(`pointer:${event.pointerId}`)
      },
      onPointerUp: (event: React.PointerEvent<HTMLButtonElement>) => {
        if (attempt.current?.input === `pointer:${event.pointerId}`) cancel()
      },
      onPointerCancel: cancel,
      onLostPointerCapture: cancel,
      onPointerLeave: cancel,
      onPointerMove: (event: React.PointerEvent<HTMLButtonElement>) => {
        if (attempt.current?.input !== `pointer:${event.pointerId}`) return
        const rect = event.currentTarget.getBoundingClientRect()
        if (
          event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom
        )
          cancel()
      },
      onKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>) => {
        if (event.key !== ' ' && event.key !== 'Enter') {
          cancel()
          return
        }
        event.preventDefault()
        if (!event.repeat) start(`key:${event.key}`)
      },
      onKeyUp: (event: React.KeyboardEvent<HTMLButtonElement>) => {
        if (event.key !== ' ' && event.key !== 'Enter') return
        event.preventDefault()
        if (attempt.current?.input === `key:${event.key}`) cancel()
      },
      onBlur: cancel,
    },
  }
}
