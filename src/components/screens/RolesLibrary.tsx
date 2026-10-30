import { useLayoutEffect, useRef } from 'react'
import { getTeam, type TeamId } from '../../lib/teams'
import type { RoleId } from '../../lib/roles/types'
import type { ScriptId } from '../../lib/scripts'
import { useI18n, getRoleName, getRoleDescription } from '../../lib/i18n'
import { Icon, BackButton } from '../atoms'
import { RoleCard } from '../items/RoleCard'
import { TeamBackground } from '../items/TeamBackground'
import { cn } from '../../lib/utils'
import {
  LIBRARY_TEAMS,
  useRoleLibraryNavigation,
} from './roleLibraryNavigation'

type Props = {
  mode?: 'standalone' | 'player'
  scriptId?: ScriptId
  title?: string
  introduction?: string
  backLabel?: string
  initialRoleId?: RoleId | null
  onBack: () => void
}

export function RolesLibrary({
  mode = 'standalone',
  scriptId = 'trouble-brewing',
  title,
  introduction,
  backLabel,
  initialRoleId = null,
  onBack,
}: Props) {
  const { t, language } = useI18n()
  const nav = useRoleLibraryNavigation({
    mode,
    scriptId,
    initialRoleId,
    onExit: onBack,
  })
  const { entry } = nav
  const region = useRef<HTMLDivElement>(null)
  const groupButtons = useRef(new Map<string, HTMLButtonElement>())
  const navRef = useRef(nav)
  navRef.current = nav
  const restoring = useRef(false)
  useLayoutEffect(() => {
    const element = region.current
    if (!element) return
    restoring.current = true
    if (document.activeElement === element.querySelector('select')) {
      // Keep a keyboard-operated category picker focused while switching.
    } else if (entry.view === 'category' && navRef.current.lastRole) {
      groupButtons.current
        .get(navRef.current.lastRole)
        ?.focus({ preventScroll: true })
    } else if (entry.view === 'categories' && entry.focusCategory) {
      element
        .querySelector<HTMLButtonElement>(
          `[data-category="${entry.focusCategory}"]`,
        )
        ?.focus({ preventScroll: true })
    } else if (entry.view === 'category') {
      element.querySelector<HTMLElement>('h1')?.focus({ preventScroll: true })
    }
    element.scrollTop = navRef.current.scroll
    // Layout/font/language changes must not choose another category or reset scroll.
    restoring.current = false
  }, [entry.id, entry.view, entry.category, entry.role])
  const selectedRole = entry.role
    ? nav.roles.find((role) => role.id === entry.role)
    : undefined
  const group = nav.roles.filter((role) => role.team === entry.category)
  const index = group.findIndex((role) => role.id === entry.role)
  const count = (n: number) =>
    `${n} ${n === 1 ? t.library.character : t.library.characters}`
  const categoryButtons = () =>
    LIBRARY_TEAMS.map((teamId) => {
      const team = getTeam(teamId)
      const roles = nav.roles.filter((role) => role.team === teamId)
      return (
        <button
          key={teamId}
          type='button'
          data-category={teamId}
          onClick={() => nav.selectCategory(teamId)}
          className={cn(
            'rounded-xl border text-left p-4 min-h-[120px] flex flex-col gap-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-mystic-gold',
            team.colors.badge,
          )}
        >
          <Icon name={team.icon} size='lg' className={team.colors.accent} />
          <span className={cn('font-tarot font-medium', team.colors.text)}>
            {t.library[teamId]}
          </span>
          <span className='flex items-center justify-between gap-2 w-full text-xs text-parchment-300'>
            <span>{count(roles.length)}</span>
            <Icon name='chevronRight' size='sm' />
          </span>
        </button>
      )
    })
  return (
    <div
      className='h-full min-h-0 flex flex-col bg-grimoire-dark text-parchment-100'
      data-library-view={entry.view}
    >
      <div className='screen-navigation px-3'>
        <BackButton
          onClick={nav.back}
          label={
            entry.view === 'category' ? t.library.categories : t.common.back
          }
        />
        {backLabel && (
          <button
            type='button'
            onClick={nav.leave}
            className='min-h-11 px-3 py-2 text-sm text-mystic-gold leading-snug'
          >
            {backLabel}
          </button>
        )}
      </div>
      <div
        ref={region}
        className='role-library-scroll flex-1 min-h-0 overflow-y-auto overscroll-contain'
        onScroll={(event) => {
          if (!restoring.current) nav.saveScroll(event.currentTarget.scrollTop)
        }}
      >
        {selectedRole ? (
          <TeamBackground teamId={selectedRole.team}>
            <div className='flex justify-between items-center gap-3 w-full max-w-sm mb-4'>
              <button
                type='button'
                disabled={group.length < 2}
                aria-label={t.playerReference.previousCharacter}
                onClick={() =>
                  nav.selectRole(
                    group[(index - 1 + group.length) % group.length].id,
                  )
                }
                className='w-12 h-12 shrink-0 rounded-full text-mystic-gold disabled:opacity-30 flex items-center justify-center'
              >
                <Icon name='chevronLeft' size='xl' />
              </button>
              <p className='text-sm text-center text-parchment-300'>
                {entry.category && t.library[entry.category]}
              </p>
              <button
                type='button'
                disabled={group.length < 2}
                aria-label={t.playerReference.nextCharacter}
                onClick={() =>
                  nav.selectRole(group[(index + 1) % group.length].id)
                }
                className='w-12 h-12 shrink-0 rounded-full text-mystic-gold disabled:opacity-30 flex items-center justify-center'
              >
                <Icon name='chevronRight' size='xl' />
              </button>
            </div>
            <RoleCard roleId={selectedRole.id} />
          </TeamBackground>
        ) : (
          <div className='max-w-lg mx-auto w-full p-4'>
            {entry.view === 'categories' ? (
              <>
                <h1 className='font-tarot text-xl tracking-wide uppercase mb-2'>
                  {title ?? t.mainMenu.rolesLibrary}
                </h1>
                <p className='text-sm text-parchment-400 mb-5'>
                  {introduction ?? t.mainMenu.browseAllRoles}
                </p>
                <div className='role-category-grid'>{categoryButtons()}</div>
              </>
            ) : (
              <>
                <h1
                  tabIndex={-1}
                  className='font-tarot text-xl tracking-wide uppercase'
                >
                  {entry.category && t.library[entry.category]}
                </h1>
                <p className='text-sm text-parchment-400 mt-1 mb-4'>
                  {count(group.length)}
                </p>
                <nav
                  aria-label={t.library.switchCategory}
                  className='sticky top-0 z-10 mb-4 py-2 bg-grimoire-dark'
                >
                  <select
                    aria-label={t.library.switchCategory}
                    value={entry.category ?? ''}
                    onChange={(event) =>
                      nav.selectCategory(event.target.value as TeamId)
                    }
                    className='w-full min-h-11 rounded-lg border border-mystic-gold/30 bg-grimoire-dark px-3 py-2 text-sm text-parchment-100 focus-visible:outline focus-visible:outline-mystic-gold'
                  >
                    {LIBRARY_TEAMS.map((teamId) => (
                      <option key={teamId} value={teamId}>
                        {t.library[teamId]} (
                        {
                          nav.roles.filter((role) => role.team === teamId)
                            .length
                        }
                        )
                      </option>
                    ))}
                  </select>
                </nav>
                <div className='space-y-1'>
                  {group.map((role) => {
                    const team = getTeam(role.team)
                    return (
                      <button
                        key={role.id}
                        type='button'
                        data-role-id={role.id}
                        ref={(button) => {
                          if (button) groupButtons.current.set(role.id, button)
                          else groupButtons.current.delete(role.id)
                        }}
                        aria-current={
                          nav.lastRole === role.id ? 'true' : undefined
                        }
                        onClick={() => nav.selectRole(role.id)}
                        className={cn(
                          'w-full py-3 px-3 text-left rounded-lg border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-mystic-gold',
                          nav.lastRole === role.id
                            ? 'border-mystic-gold/50 bg-white/5'
                            : 'border-transparent hover:bg-white/5',
                        )}
                      >
                        <span className='role-library-row flex items-start gap-3'>
                          <span
                            className={cn(
                              'role-library-icon w-10 h-10 rounded-full flex items-center justify-center shrink-0 border',
                              team.colors.badge,
                            )}
                          >
                            <Icon
                              name={role.icon}
                              size='md'
                              className={team.colors.accent}
                            />
                          </span>
                          <span className='role-library-label flex-1 min-w-0'>
                            <span
                              className={cn(
                                'block font-tarot text-sm uppercase tracking-wide',
                                team.colors.text,
                              )}
                            >
                              {getRoleName(role.id, language)}
                            </span>
                            <span className='block text-xs text-parchment-400 mt-1 leading-relaxed'>
                              {getRoleDescription(role.id, language)}
                            </span>
                          </span>
                          <Icon
                            name='chevronRight'
                            size='sm'
                            className='role-library-chevron shrink-0 mt-1 text-parchment-500'
                          />
                        </span>
                      </button>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
