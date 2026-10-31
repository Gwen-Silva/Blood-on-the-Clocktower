import { useI18n, interpolate } from '../../lib/i18n'
import {
  getEligibleVoteOperation,
  getPendingVoteCorrection,
} from '../../lib/voteHistory'
import type { Game } from '../../lib/types'
import { Button } from '../atoms'
import { CorrectionConfirmation } from './CorrectionConfirmation'
export function VoteCorrectionControl({
  game,
  onConfirm,
  onResume,
}: {
  game: Game
  onConfirm: (operationId: string) => boolean
  onResume: () => void
}) {
  const { t } = useI18n(),
    copy = t.voteCorrection,
    pending = getPendingVoteCorrection(game),
    target = getEligibleVoteOperation(game)
  if (pending)
    return (
      <section className='rounded-xl border border-mystic-gold/30 p-4 mb-4 space-y-3'>
        <p>{copy.pending}</p>
        <Button
          variant='gold'
          className='whitespace-normal h-auto min-h-12 py-3'
          fullWidth
          onClick={onResume}
        >
          {copy.resume}
        </Button>
      </section>
    )
  if (!target) return null
  return (
    <CorrectionConfirmation
      operationKey={target.operationId}
      action={copy.action}
      title={copy.title}
      description={
        <>
          <p>
            {interpolate(copy.summary, {
              player: target.nomineeName,
              votes: target.voteCount,
            })}
          </p>
          <p>
            {target.previousBlock
              ? interpolate(copy.prior, {
                  player: target.previousBlock.playerName,
                  votes: target.previousBlock.voteCount,
                })
              : interpolate(copy.none, { votes: target.previousBenchmark })}
          </p>
          <p>{copy.restore}</p>
        </>
      }
      restriction={copy.limit}
      error={copy.error}
      confirm={copy.confirm}
      cancel={t.common.cancel}
      onConfirm={() => onConfirm(target.operationId)}
    />
  )
}
