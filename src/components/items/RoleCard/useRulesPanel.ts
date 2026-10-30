import { useCallback, useEffect, useRef, useState } from 'react'

/** Consume only the panel's Back entry before router / private reveal handlers. */
export function useRulesPanel() {
  const [open, setOpen] = useState(false)
  const token = useRef<string>()
  const previousState = useRef<unknown>()
  const closing = useRef(false)
  useEffect(() => {
    if (!open) return
    const onBack = (event: PopStateEvent) => {
      event.stopImmediatePropagation()
      token.current = undefined
      closing.current = false
      setOpen(false)
    }
    window.addEventListener('popstate', onBack, true)
    return () => {
      window.removeEventListener('popstate', onBack, true)
      if (token.current && history.state?.__roleRules === token.current) {
        history.replaceState(previousState.current, '', location.href)
      }
      token.current = undefined
    }
  }, [open])
  const changeOpen = useCallback((next: boolean) => {
    if (next) {
      if (token.current) return
      previousState.current = history.state
      closing.current = false
      token.current = `rules-${Date.now()}-${Math.random()}`
      history.pushState(
        { ...history.state, __roleRules: token.current },
        '',
        location.href,
      )
      setOpen(true)
    } else if (token.current && history.state?.__roleRules === token.current) {
      if (closing.current) return
      closing.current = true
      history.back()
    } else {
      setOpen(false)
    }
  }, [])
  return { open, changeOpen }
}
