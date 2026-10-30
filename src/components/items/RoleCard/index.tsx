import { getRole } from '../../../lib/roles'
import { getRoleWikiUrl } from '../../../lib/roles/wiki'
import { getTeam, TeamId } from '../../../lib/teams'
import {
  useI18n,
  interpolate,
  getRoleDescription,
  getRoleName,
  getRoleQuote,
  getRoleLines,
} from '../../../lib/i18n'
import { cn } from '../../../lib/utils'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
} from '../../atoms/dialog'
import { CardShell } from './CardShell'
import { CardIcon } from './CardIcon'
import { RoleName } from './RoleName'
import { useRulesPanel } from './useRulesPanel'

// Editorial choices by stable role ID, independent of text length and locale.
const SUPPORTING_LINES: Record<string, number[]> = {
  imp: [2],
  baron: [2],
  butler: [2],
  empath: [1],
  drunk: [1],
  poisoner: [1],
  ravenkeeper: [1],
  spy: [1],
  undertaker: [1],
  virgin: [2],
  scarlet_woman: [1],
}

type Props = { roleId: string; context?: 'own' | 'reference' }

/** Static character information only. No game, player or Storyteller data. */
export function RoleCard({ roleId, context = 'reference' }: Props) {
  const { t, language } = useI18n()
  const { open, changeOpen } = useRulesPanel()
  const role = getRole(roleId)
  if (!role)
    return (
      <p className='text-red-400 font-tarot text-center p-4'>
        {interpolate(t.ui.unknownRoleId, { roleId })}
      </p>
    )
  const teamId = role.team as TeamId
  const team = getTeam(teamId)
  const name = getRoleName(roleId, language)
  const description = getRoleDescription(roleId, language)
  const lines = getRoleLines(roleId, language)
  const quote = getRoleQuote(roleId, language)
  const wiki = getRoleWikiUrl(roleId)
  const facts = (SUPPORTING_LINES[roleId] ?? [])
    .map((index) => lines[index]?.text)
    .filter(Boolean)
  if (roleId === 'saint') facts.push(t.clarity.saintNote)
  return (
    <Dialog open={open} onOpenChange={changeOpen}>
      <CardShell teamId={teamId} icon={role.icon}>
        <div className='flex flex-col items-center pt-2'>
          <CardIcon icon={role.icon} teamId={teamId} />
          <RoleName name={name} className={team.colors.cardText} />
          <p
            className={cn(
              'text-center text-xs tracking-widest uppercase',
              team.colors.cardTeamBadge,
            )}
          >
            {t.teams[teamId].name}
          </p>
        </div>
        <div
          className={cn(
            'flex-1 flex flex-col justify-center gap-4 pt-5',
            team.colors.cardText,
          )}
        >
          <div
            className={cn(
              'role-card-ability rounded-lg border p-4',
              teamId === 'townsfolk' || teamId === 'outsider'
                ? 'bg-black/5 border-black/10'
                : 'bg-white/5 border-white/15',
            )}
          >
            <p className='text-xs uppercase tracking-wide mb-2 text-center'>
              {context === 'own' ? t.clarity.yourAbility : t.clarity.reference}
            </p>
            <p className='text-sm leading-relaxed text-center'>{description}</p>
          </div>
          {facts.map((fact) => (
            <p key={fact} className='text-sm leading-relaxed text-center'>
              {fact}
            </p>
          ))}
          <DialogTrigger asChild>
            <button
              type='button'
              className='min-h-[44px] rounded-lg border border-current px-4 py-3 text-sm font-medium hover:bg-black/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
            >
              {t.clarity.rules}
            </button>
          </DialogTrigger>
        </div>
      </CardShell>
      <DialogContent className='role-rules-dialog'>
        <DialogHeader>
          <DialogTitle asChild>
            <div>
              <RoleName name={name} as='h2' className='text-parchment-100' />
            </div>
          </DialogTitle>
          <DialogDescription>
            {t.clarity.reference} · {t.teams[teamId].name}
          </DialogDescription>
        </DialogHeader>
        <DialogBody className='space-y-4 text-parchment-200 text-sm leading-relaxed'>
          <section className='rounded-lg bg-white/5 border border-white/10 p-4'>
            <h2 className='text-xs uppercase tracking-wide text-mystic-gold mb-2'>
              {t.clarity.yourAbility}
            </h2>
            <p>{description}</p>
          </section>
          <section className='space-y-3' aria-label={t.clarity.details}>
            {lines.map((line, index) => (
              <p className='rounded-lg bg-white/5 p-4' key={index}>
                {line.text}
              </p>
            ))}
          </section>
          {quote && <p className='italic text-parchment-400'>“{quote}”</p>}
          {wiki && (
            <a
              href={wiki}
              target='_blank'
              rel='noopener noreferrer'
              referrerPolicy='no-referrer'
              className='inline-flex min-h-[44px] items-center underline text-mystic-gold'
            >
              {t.clarity.officialWiki}
            </a>
          )}
        </DialogBody>
      </DialogContent>
    </Dialog>
  )
}
