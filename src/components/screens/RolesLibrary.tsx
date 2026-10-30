import { useMemo } from 'react'
import { getRole } from '../../lib/roles'
import { SCRIPTS, type ScriptId } from '../../lib/scripts'
import { RoleId } from '../../lib/roles/types'
import { getTeam, TeamId } from '../../lib/teams'
import { useI18n, getRoleName, getRoleDescription } from '../../lib/i18n'
import { Icon, BackButton } from '../atoms'
import { RoleCard } from '../items/RoleCard'
import { TeamBackground } from '../items/TeamBackground'
import { MysticDivider } from '../items'
import { cn } from '../../lib/utils'

type Props = {
  scriptId?: ScriptId
  title?: string
  introduction?: string
  backLabel?: string
  showAbilityDescription?: boolean
  selectedRoleId: RoleId | null
  onBack: () => void
  onSelectRole: (roleId: RoleId) => void
  onDeselectRole: () => void
}

const TEAM_ORDER: TeamId[] = ['townsfolk', 'outsider', 'minion', 'demon']

export function RolesLibrary({
  selectedRoleId,
  onBack,
  onSelectRole,
  onDeselectRole,
  scriptId = 'trouble-brewing',
  title,
  introduction,
  backLabel,
  showAbilityDescription = false,
}: Props) {
  const { t, language } = useI18n()

  // Static catalog only: never selected roles or assigned players.
  const scriptRoles = SCRIPTS[scriptId].roles

  // Group roles by team
  const rolesByTeam = TEAM_ORDER.map((teamId) => {
    const team = getTeam(teamId)
    const roles = scriptRoles
      .map((roleId) => getRole(roleId))
      .filter(
        (role): role is NonNullable<ReturnType<typeof getRole>> =>
          role !== undefined && role.team === teamId,
      )
    return { teamId, team, roles }
  }).filter((group) => group.roles.length > 0)

  // Flat ordered list of all role IDs for arrow navigation
  const allRoleIds = useMemo(
    () => rolesByTeam.flatMap((group) => group.roles.map((r) => r.id)),
    [rolesByTeam],
  )

  // If a role is selected, show its full RoleCard with prev/next navigation
  if (selectedRoleId) {
    const selectedRole = getRole(selectedRoleId)
    const selectedTeamId = selectedRole?.team ?? 'townsfolk'
    const selectedTeam = getTeam(selectedTeamId)

    const currentIndex = allRoleIds.indexOf(selectedRoleId)
    const goToPrev = () => {
      const prevIndex =
        (currentIndex - 1 + allRoleIds.length) % allRoleIds.length
      onSelectRole(allRoleIds[prevIndex])
    }
    const goToNext = () => {
      const nextIndex = (currentIndex + 1) % allRoleIds.length
      onSelectRole(allRoleIds[nextIndex])
    }

    return (
      <div className='min-h-app flex flex-col bg-grimoire-dark'>
        <div className='screen-navigation'>
          <BackButton onClick={onDeselectRole} label={t.common.back} />
          {backLabel && (
            <button
              onClick={onBack}
              className='min-h-11 px-3 py-2 text-sm text-mystic-gold leading-snug'
            >
              {backLabel}
            </button>
          )}
        </div>
        <div className='reference-detail-content'>
          <TeamBackground teamId={selectedTeamId}>
            {/* Navigation arrows */}
            <div className='flex justify-between gap-4 w-full max-w-sm mb-4'>
              <button
                aria-label={t.playerReference.previousCharacter}
                onClick={goToPrev}
                className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center transition-colors',
                  selectedTeam.isEvil
                    ? 'text-red-400/50 hover:text-red-300 hover:bg-red-900/20'
                    : 'text-parchment-400/50 hover:text-parchment-200 hover:bg-white/10',
                )}
              >
                <Icon name='chevronLeft' size='xl' />
              </button>
              <button
                aria-label={t.playerReference.nextCharacter}
                onClick={goToNext}
                className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center transition-colors',
                  selectedTeam.isEvil
                    ? 'text-red-400/50 hover:text-red-300 hover:bg-red-900/20'
                    : 'text-parchment-400/50 hover:text-parchment-200 hover:bg-white/10',
                )}
              >
                <Icon name='chevronRight' size='xl' />
              </button>
            </div>

            <RoleCard roleId={selectedRoleId} />
            {showAbilityDescription && (
              <p className='max-w-sm text-sm text-parchment-200 leading-relaxed text-center px-4 mt-4'>
                {getRoleDescription(selectedRoleId, language)}
              </p>
            )}
          </TeamBackground>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-app bg-gradient-to-b from-grimoire-purple via-grimoire-dark to-grimoire-darker flex flex-col'>
      {/* Header */}
      <div className='px-4 pt-6 pb-4'>
        <div className='screen-navigation mb-3'>
          <BackButton onClick={onBack} label={backLabel} />
        </div>
        <div className='max-w-lg mx-auto mb-4'>
          <h1 className='font-tarot text-xl text-parchment-100 tracking-wider uppercase'>
            {title ?? t.mainMenu.rolesLibrary}
          </h1>
          <p className='text-sm text-parchment-400'>
            {introduction ?? t.mainMenu.browseAllRoles}
          </p>
          <p className='text-xs text-parchment-500 mt-2'>
            {scriptRoles.length} {t.common.roles}
          </p>
        </div>
        <MysticDivider />
      </div>

      {/* Role List */}
      <div className='flex-1 overflow-y-auto px-4 pb-6'>
        <div className='space-y-6 max-w-lg mx-auto w-full'>
          {rolesByTeam.map(({ teamId, team, roles }) => {
            const teamTranslation = t.teams[teamId as keyof typeof t.teams]
            const isEvil = team.isEvil

            return (
              <section
                key={teamId}
                aria-label={`${t.teams[teamId].name} (${roles.length})`}
              >
                {/* Team Header */}
                <div className='flex items-center gap-2 mb-3'>
                  <Icon
                    name={team.icon}
                    size='sm'
                    className={isEvil ? 'text-red-400' : 'text-mystic-gold'}
                  />
                  <span
                    className={cn(
                      'text-sm font-semibold tracking-wider uppercase',
                      isEvil ? 'text-red-400' : 'text-mystic-gold',
                    )}
                  >
                    {teamTranslation?.name ?? teamId}
                  </span>
                  <span className='text-xs text-parchment-500'>
                    ({roles.length})
                  </span>
                </div>

                {/* Role Items */}
                <div className='space-y-1'>
                  {roles.map((role) => {
                    const roleName = getRoleName(role.id, language)
                    const roleDescription = getRoleDescription(
                      role.id,
                      language,
                    )

                    return (
                      <button
                        key={role.id}
                        onClick={() => onSelectRole(role.id)}
                        className={cn(
                          'w-full py-3 px-4 text-left rounded-lg transition-colors group',
                          isEvil
                            ? 'hover:bg-red-950/30 border border-transparent hover:border-red-900/30'
                            : 'hover:bg-white/5 border border-transparent hover:border-white/10',
                        )}
                      >
                        <div className='flex items-start gap-3'>
                          <div
                            className={cn(
                              'w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5',
                              isEvil
                                ? 'bg-red-900/30 border border-red-600/30'
                                : 'bg-mystic-gold/10 border border-mystic-gold/20',
                            )}
                          >
                            <Icon
                              name={role.icon}
                              size='md'
                              className={
                                isEvil ? 'text-red-400' : 'text-mystic-gold'
                              }
                            />
                          </div>
                          <div className='flex-1 min-w-0'>
                            <div
                              className={cn(
                                'font-tarot text-sm uppercase tracking-wider',
                                isEvil
                                  ? 'text-red-300 group-hover:text-red-200'
                                  : 'text-parchment-100 group-hover:text-parchment-50',
                              )}
                            >
                              {roleName}
                            </div>
                            <p className='text-xs text-parchment-500 mt-0.5 line-clamp-2'>
                              {roleDescription}
                            </p>
                          </div>
                          <Icon
                            name='arrowRight'
                            size='sm'
                            className='text-parchment-600 group-hover:text-parchment-400 transition-colors mt-1 shrink-0'
                          />
                        </div>
                      </button>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>
      </div>
    </div>
  )
}
