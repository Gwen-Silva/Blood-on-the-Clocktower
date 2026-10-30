import { formatRoleQuantity } from '../../lib/roleDisplay'
import { SetupPlan, isSetupPlanValid } from '../../lib/setupPlan'
import { getRole } from '../../lib/roles'
import { getTeam, TeamId } from '../../lib/teams'
import { useI18n, interpolate, getRoleName } from '../../lib/i18n'
import { Button, BackButton, Badge } from '../atoms'
import { ScreenFooter } from '../layouts/ScreenFooter'

type Props = {
  plan: SetupPlan
  onEdit: (step: 'players' | 'script' | 'roles' | 'assign') => void
  onConfirm: () => void
}

export function SetupReview({ plan, onEdit, onConfirm }: Props) {
  const { t, language } = useI18n()
  const copy = t.setupReview
  const manualCount = plan.players.filter(
    ({ id }) => plan.manualAssignments[id],
  ).length
  const mode = !manualCount
    ? copy.allRandom
    : manualCount === plan.players.length
      ? copy.allManual
      : copy.mixed
  const teams: TeamId[] = ['townsfolk', 'outsider', 'minion', 'demon']
  const valid = isSetupPlanValid(plan)
  return (
    <div className='min-h-app bg-gradient-to-b from-grimoire-purple via-grimoire-dark to-grimoire-darker flex flex-col'>
      <header className='px-4 py-3 border-b border-mystic-gold/20'>
        <div className='max-w-lg mx-auto flex items-center gap-3'>
          <BackButton onClick={() => onEdit('assign')} />
          <h1 className='font-tarot text-xl text-parchment-100'>
            {copy.reviewSetup}
          </h1>
        </div>
      </header>
      <main className='flex-1 px-4 py-5 max-w-lg mx-auto w-full space-y-5 text-parchment-200'>
        <p className='text-sm text-parchment-400'>{copy.notFinalized}</p>
        <section
          className='rounded-xl border border-white/10 bg-white/5 p-4 space-y-3'
          aria-label={copy.composition}
        >
          <h2 className='font-tarot text-mystic-gold'>{copy.composition}</h2>
          <p>
            {t.scripts[plan.scriptId]} ·{' '}
            {interpolate(copy.playerCount, { count: plan.players.length })}
          </p>
          <Button
            variant='secondary'
            size='sm'
            onClick={() => onEdit('script')}
          >
            {copy.editScript}
          </Button>
          <p className='text-sm'>{copy.clockwise}</p>
          <ol className='space-y-2'>
            {plan.players.map((player, index) => (
              <li key={player.id} className='break-words'>
                {index + 1}. {player.name}
              </li>
            ))}
          </ol>
          <Button
            variant='secondary'
            size='sm'
            onClick={() => onEdit('players')}
          >
            {copy.editPlayers}
          </Button>
        </section>
        <section
          className='rounded-xl border border-white/10 bg-white/5 p-4 space-y-3'
          aria-label={copy.characters}
        >
          <h2 className='font-tarot text-mystic-gold'>{copy.characters}</h2>
          <p className='text-sm'>
            {interpolate(
              plan.selectedRoles.length > plan.players.length
                ? copy.largerPool
                : copy.selectedCount,
              {
                count: plan.selectedRoles.length,
                players: plan.players.length,
              },
            )}
          </p>
          {teams.map((team) => {
            const roles = plan.selectedRoles.filter(
              (id) => getRole(id)?.team === team,
            )
            const unique = [...new Set(roles)]
            return (
              <div key={team}>
                <h3 className='text-sm'>
                  {t.teams[team].name} ({roles.length})
                </h3>
                <div className='flex flex-wrap gap-2 mt-1'>
                  {unique.map((id) => (
                    <Badge key={id} variant={team}>
                      {formatRoleQuantity(
                        getRoleName(id, language),
                        roles.filter((role) => role === id).length,
                      )}
                    </Badge>
                  ))}
                </div>
              </div>
            )
          })}
          <Button variant='secondary' size='sm' onClick={() => onEdit('roles')}>
            {copy.editCharacters}
          </Button>
        </section>
        <section
          className='rounded-xl border border-white/10 bg-white/5 p-4 space-y-3'
          aria-label={copy.assignments}
        >
          <h2 className='font-tarot text-mystic-gold'>{copy.assignments}</h2>
          <p>{mode}</p>
          <ol className='space-y-3'>
            {plan.players.map((player, index) => {
              const id = plan.manualAssignments[player.id]
              const role = id && getRole(id)
              return (
                <li
                  key={player.id}
                  className='flex flex-wrap gap-2 items-center break-words'
                >
                  <span>
                    {index + 1}. {player.name}
                  </span>
                  {role ? (
                    <Badge variant={getTeam(role.team).id}>
                      {getRoleName(role.id, language)}
                    </Badge>
                  ) : (
                    <span className='text-sm text-parchment-400'>
                      {copy.awaitingRandom}
                    </span>
                  )}
                </li>
              )
            })}
          </ol>
          <Button
            variant='secondary'
            size='sm'
            onClick={() => onEdit('assign')}
          >
            {copy.editAssignments}
          </Button>
        </section>
        {!valid && (
          <p role='alert' className='text-red-300'>
            {copy.invalidPlan}
          </p>
        )}
      </main>
      <ScreenFooter>
        <Button
          variant='gold'
          fullWidth
          size='lg'
          disabled={!valid}
          onClick={onConfirm}
        >
          {copy.createGame}
        </Button>
      </ScreenFooter>
    </div>
  )
}
