import { createContext, useContext } from 'react'
import { useI18n, getRoleName } from '../../lib/i18n'

export const NightRoleContext = createContext<string | null>(null)

/** Static instructions only. This component never receives game state. */
export function NightGuidance({
  roleId,
  audience = 'narrator',
  compact = false,
}: {
  roleId?: string
  audience?: 'narrator' | 'player'
  compact?: boolean
}) {
  const contextualRole = useContext(NightRoleContext)
  const { t, language } = useI18n()
  const id = roleId ?? contextualRole
  const guide = id ? t.nightGuide.roles[id] : undefined
  if (!guide || !id) return null
  const isPrivate = audience === 'narrator'
  return (
    <section
      aria-label={isPrivate ? t.nightGuide.title : t.nightGuide.playerTitle}
      className='my-4 rounded-xl border border-mystic-gold/20 bg-grimoire-dark/70 p-4 text-sm leading-relaxed text-parchment-200 w-full max-w-lg mx-auto'
    >
      <h2 className='font-medium text-mystic-gold mb-2'>
        {isPrivate ? t.nightGuide.title : t.nightGuide.playerTitle} ·{' '}
        {getRoleName(id, language)}
      </h2>
      <p>{isPrivate ? guide.now : guide.player}</p>
      {!compact && (
        <>
          {isPrivate && (guide.note || guide.example) && (
            <details className='mt-2'>
              <summary className='min-h-11 py-3 text-mystic-gold cursor-pointer'>
                {t.nightGuide.checks}
              </summary>
              {guide.note && <p className='text-parchment-400'>{guide.note}</p>}
              {guide.example && (
                <p className='mt-3'>
                  <strong>{t.nightGuide.example}: </strong>
                  {guide.example}
                </p>
              )}
            </details>
          )}
          {!isPrivate && guide.example && (
            <details className='mt-3'>
              <summary className='cursor-pointer min-h-11 py-3'>
                {t.nightGuide.example}
              </summary>
              <p>{guide.example}</p>
            </details>
          )}
        </>
      )}
    </section>
  )
}
