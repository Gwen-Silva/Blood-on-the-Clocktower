import { useI18n, interpolate, getEffectName } from '../../lib/i18n'
import { getEligibleEffectEdit } from '../../lib/manualEffectCorrection'
import type { Game } from '../../lib/types'
import { CorrectionConfirmation } from './CorrectionConfirmation'
export function EffectCorrectionControl({
  game,
  onConfirm,
}: {
  game: Game
  onConfirm: (eventId: string) => boolean
}) {
  const { t, language } = useI18n(),
    copy = t.effectCorrection,
    target = getEligibleEffectEdit(game)
  if (!target) return null
  return (
    <CorrectionConfirmation
      operationKey={target.eventId}
      action={copy.action}
      title={copy.title}
      description={
        <p>
          {interpolate(copy[target.operation], {
            player: target.playerName,
            effect: getEffectName(target.effectType, language),
          })}
        </p>
      }
      restriction={copy.limit}
      error={copy.error}
      confirm={copy.confirm}
      cancel={t.common.cancel}
      onConfirm={() => onConfirm(target.eventId)}
    />
  )
}
