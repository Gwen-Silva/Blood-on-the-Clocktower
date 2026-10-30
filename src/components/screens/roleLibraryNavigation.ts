import { useLayoutEffect, useRef, useState } from 'react'
import { getRole } from '../../lib/roles'
import type { RoleId } from '../../lib/roles/types'
import { SCRIPTS, type ScriptId } from '../../lib/scripts'
import type { TeamId } from '../../lib/teams'
import { router } from '../../lib/router'

export const LIBRARY_TEAMS: TeamId[] = [
  'townsfolk',
  'outsider',
  'minion',
  'demon',
]
type Mode = 'standalone' | 'player'
type Entry = {
  id: string
  session: string
  mode: Mode
  scriptId: ScriptId
  view: 'categories' | 'category' | 'role'
  category: TeamId | null
  role: RoleId | null
  scroll: number
  lastRole: RoleId | null
  focusCategory?: TeamId
  parent?: string
  depth: number
  fromHome?: boolean
}
type Position = { scroll: number; lastRole: RoleId | null }
// Static UI navigation only. No game IDs, assignments, effects or save writes.
const entries = new Map<string, Entry>()
const positions = new Map<string, Position>()
let sequence = 0
const id = () => `catalog-${Date.now()}-${++sequence}`
const positionKey = (entry: Entry, category = entry.category) =>
  `${entry.session}:${category}`
function remember(entry: Entry) {
  entries.set(entry.id, entry)
  // History entries carry their own fallback snapshot; bound the in-memory cache.
  if (entries.size > 200) entries.delete(entries.keys().next().value!)
  if (positions.size > 100) positions.delete(positions.keys().next().value!)
}
function readEntry(
  value: unknown,
  mode: Mode,
  role: RoleId | null,
): Entry | undefined {
  const entry = (value as { __roleLibrary?: Entry } | null)?.__roleLibrary
  if (
    !entry ||
    entry.mode !== mode ||
    typeof entry.id !== 'string' ||
    typeof entry.session !== 'string' ||
    !['trouble-brewing', 'custom'].includes(entry.scriptId) ||
    !['categories', 'category', 'role'].includes(entry.view) ||
    !Number.isFinite(entry.scroll) ||
    entry.scroll < 0 ||
    !Number.isInteger(entry.depth) ||
    entry.depth < 0 ||
    entry.depth > 3 ||
    (entry.category !== null && !LIBRARY_TEAMS.includes(entry.category)) ||
    (entry.role !== null && !getRole(entry.role)) ||
    (mode === 'standalone' && entry.role !== role)
  )
    return undefined
  return entry
}

export function useRoleLibraryNavigation({
  mode,
  scriptId,
  initialRoleId,
  onExit,
}: {
  mode: Mode
  scriptId: ScriptId
  initialRoleId: RoleId | null
  onExit: () => void
}) {
  const [entry, setEntry] = useState<Entry>(() => {
    const existing =
      mode === 'standalone'
        ? readEntry(history.state, mode, initialRoleId)
        : undefined
    if (existing)
      return {
        ...existing,
        focusCategory:
          entries.get(existing.id)?.focusCategory ?? existing.focusCategory,
      }
    const session = id()
    const initial: Entry = {
      id: id(),
      session,
      mode,
      scriptId:
        mode === 'standalone' && initialRoleId === 'villager'
          ? 'custom'
          : scriptId,
      view: initialRoleId ? 'role' : 'categories',
      category: initialRoleId ? getRole(initialRoleId)!.team : null,
      role: initialRoleId,
      scroll: 0,
      lastRole: initialRoleId,
      depth: mode === 'player' ? 1 : 0,
      fromHome:
        mode === 'standalone' && history.state?.__roleLibraryFromHome === true,
    }
    if (mode === 'standalone' && initialRoleId) {
      // Direct links get real logical parents, once. Native Back/Forward can
      // then follow detail -> category -> landing without interception loops.
      const landing: Entry = {
        ...initial,
        id: id(),
        view: 'categories',
        role: null,
        category: null,
        lastRole: null,
        focusCategory: initial.category!,
        depth: 0,
      }
      const category: Entry = {
        ...initial,
        id: id(),
        view: 'category',
        role: null,
        parent: landing.id,
        depth: 1,
      }
      remember(landing)
      remember(category)
      return { ...initial, parent: category.id, depth: 2 }
    }
    return initial
  })
  const current = useRef(entry)
  current.current = entry
  const exit = useRef(onExit)
  exit.current = onExit
  const initialized = useRef(false)
  const pending = useRef(false)
  const sessionUrl = useRef(location.href)
  useLayoutEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      const state = { ...history.state, __roleLibrary: current.current }
      if (mode === 'player') history.pushState(state, '', sessionUrl.current)
      else if (
        current.current.view === 'role' &&
        current.current.parent &&
        history.state?.__roleLibrary?.id !== current.current.id
      ) {
        const category = entries.get(current.current.parent)!
        const landing = entries.get(category.parent!)!
        const catalogUrl = new URL(sessionUrl.current)
        catalogUrl.pathname = catalogUrl.pathname.replace(
          /\/roles\/[^/]+\/?$/,
          '/roles',
        )
        history.replaceState({ __roleLibrary: landing }, '', catalogUrl)
        history.pushState({ __roleLibrary: category }, '', catalogUrl)
        history.pushState(state, '', sessionUrl.current)
      } else history.replaceState(state, '', location.href)
      remember(current.current)
    }
    const pop = (event: PopStateEvent) => {
      const active = current.current
      const snapshot = readEntry(
        event.state,
        mode,
        mode === 'standalone'
          ? (event.state?.__roleLibrary?.role ?? null)
          : null,
      )
      const target = snapshot
        ? {
            ...snapshot,
            focusCategory:
              entries.get(snapshot.id)?.focusCategory ?? snapshot.focusCategory,
          }
        : undefined
      // A rules sheet owns its own same-entry Back event; let it close first.
      if (target?.id === active.id && !pending.current) return
      pending.current = false
      if (mode === 'player') {
        event.stopImmediatePropagation()
        if (target?.session === active.session) setEntry(target)
        else exit.current()
      } else if (target?.session === active.session) setEntry(target)
    }
    window.addEventListener('popstate', pop, true)
    return () => window.removeEventListener('popstate', pop, true)
  }, [mode])

  function commit(next: Entry, replace = false) {
    if (pending.current) return
    remember(next)
    if (mode === 'standalone') {
      const path = next.role ? `/roles/${next.role}` : '/roles'
      ;(replace ? router.replace : router.navigate)(path, {
        __roleLibrary: next,
      })
    } else {
      ;(replace ? history.replaceState : history.pushState).call(
        history,
        { ...history.state, __roleLibrary: next },
        '',
        sessionUrl.current,
      )
    }
    setEntry(next)
  }
  function saveScroll(scroll: number) {
    const active = current.current
    active.scroll = scroll
    remember(active)
    if (active.view === 'category') {
      // A history snapshot may predate arrow navigation in its child detail.
      // Saving a restored scroll event must retain the most recently viewed role.
      active.lastRole =
        positions.get(positionKey(active))?.lastRole ?? active.lastRole
      positions.set(positionKey(active), { scroll, lastRole: active.lastRole })
    }
    if (
      history.state?.__roleLibrary?.id === active.id &&
      !history.state?.__roleRules
    ) {
      history.replaceState(
        { ...history.state, __roleLibrary: active },
        '',
        location.href,
      )
    }
  }
  function selectCategory(category: TeamId) {
    const active = current.current
    if (active.view === 'category' && active.category === category) return
    const position = positions.get(positionKey(active, category))
    const switching = active.view === 'category'
    if (switching && active.parent) {
      const parent = entries.get(active.parent)
      if (parent) parent.focusCategory = category
    }
    if (!switching) {
      active.focusCategory = category
      saveScroll(active.scroll)
    }
    commit(
      {
        ...active,
        id: switching ? active.id : id(),
        view: 'category',
        category,
        role: null,
        scroll: position?.scroll ?? 0,
        lastRole: position?.lastRole ?? null,
        parent: switching ? active.parent : active.id,
        depth: switching ? active.depth : active.depth + 1,
      },
      switching,
    )
  }
  function selectRole(role: RoleId) {
    const active = current.current
    if (active.role === role) return
    const category = getRole(role)!.team
    const position = positions.get(positionKey(active, category)) ?? {
      scroll: active.view === 'category' ? active.scroll : 0,
      lastRole: null,
    }
    positions.set(positionKey(active, category), {
      ...position,
      lastRole: role,
    })
    active.lastRole = role
    saveScroll(active.scroll)
    const replacing = active.view === 'role'
    commit(
      {
        ...active,
        id: replacing ? active.id : id(),
        view: 'role',
        role,
        category,
        scroll: 0,
        lastRole: role,
        parent: replacing ? active.parent : active.id,
        depth: replacing ? active.depth : active.depth + 1,
      },
      replacing,
    )
  }
  function leave() {
    if (pending.current) return
    if (mode === 'standalone' && current.current.fromHome) {
      pending.current = true
      history.back()
      return
    }
    if (mode === 'player') {
      pending.current = true
      history.go(-current.current.depth)
    }
    exit.current()
  }
  function back() {
    const active = current.current
    if (pending.current) return
    if (active.view === 'categories') return leave()
    if (active.parent) {
      pending.current = true
      const parent = entries.get(active.parent)
      if (parent) setEntry({ ...parent })
      history.back()
    } else {
      // A direct URL has no owned parent entry. Replace rather than adding a loop.
      const category = active.view === 'role' ? active.category : null
      const position = positions.get(positionKey(active, category))
      commit(
        {
          ...active,
          id: id(),
          view: category ? 'category' : 'categories',
          role: null,
          category,
          scroll: position?.scroll ?? 0,
          lastRole: active.lastRole,
        },
        true,
      )
    }
  }
  const position =
    entry.view === 'category' ? positions.get(positionKey(entry)) : undefined
  return {
    entry,
    scroll: position?.scroll ?? entry.scroll,
    lastRole: position?.lastRole ?? entry.lastRole,
    selectCategory,
    selectRole,
    saveScroll,
    back,
    leave,
    roles: SCRIPTS[entry.scriptId].roles
      .map(getRole)
      .filter((role): role is NonNullable<typeof role> => !!role),
  }
}
