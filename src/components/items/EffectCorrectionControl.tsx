import { useRef, useState } from 'react'
import { Button } from '../atoms'
import { useI18n, interpolate, getEffectName } from '../../lib/i18n'
import {
  getEligibleEffectEdit,
  type EligibleEffectEdit,
} from '../../lib/manualEffectCorrection'
import type { Game } from '../../lib/types'

export function EffectCorrectionControl({
  game,
  onConfirm,
}: {
  game: Game
  onConfirm: (eventId: string) => boolean
}) {
  const { t, language } = useI18n()
  const copy = t.effectCorrection
  const eligible = getEligibleEffectEdit(game)
  const [target, setTarget] = useState<EligibleEffectEdit | null>(null)
  const [failed, setFailed] = useState(false)
  const confirming = useRef(false)
  if (!eligible) return null
  const active = target?.eventId === eligible.eventId ? target : null
  return (
    <section
      className='rounded-xl border border-mystic-gold/30 p-4 mb-4 space-y-3'
      aria-label={copy.title}
    >
      {!active ? (
        <Button
          variant='outline'
          fullWidth
          onClick={() => {
            setTarget(eligible)
            setFailed(false)
          }}
        >
          {copy.action}
        </Button>
      ) : (
        <>
          <h2 className='font-tarot text-mystic-gold'>{copy.title}</h2>
          <p>
            {interpolate(copy[active.operation], {
              player: active.playerName,
              effect: getEffectName(active.effectType, language),
            })}
          </p>
          <p className='text-sm text-parchment-400'>{copy.limit}</p>
          {failed && (
            <p role='alert' className='text-red-300'>
              {copy.error}
            </p>
          )}
          <Button
            variant='gold'
            fullWidth
            disabled={failed}
            onClick={() => {
              if (confirming.current || failed) return
              confirming.current = true
              try {
                if (!onConfirm(active.eventId)) {
                  setFailed(true)
                  confirming.current = false
                } else setTarget(null)
              } catch {
                setFailed(true)
                confirming.current = false
              }
            }}
          >
            {copy.confirm}
          </Button>
          <Button
            variant='secondary'
            fullWidth
            onClick={() => {
              setTarget(null)
              setFailed(false)
            }}
          >
            {t.common.cancel}
          </Button>
        </>
      )}
    </section>
  )
}
