import { useI18n, interpolate } from '../../lib/i18n'
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
} from '../atoms'

type Props = {
  open: boolean
  round: number
  nextRound: number
  blockedPlayerName: string | null
  onConfirm: () => void
  onClose: () => void
}

/** Storyteller-only confirmation; game resolution remains in GameScreen. */
export function EndDayConfirmation({
  open,
  round,
  nextRound,
  blockedPlayerName,
  onConfirm,
  onClose,
}: Props) {
  const { t } = useI18n()
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) onClose()
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {interpolate(t.game.confirmEndDayTitle, { round })}
          </DialogTitle>
          <DialogDescription className='mt-3'>
            {interpolate(
              blockedPlayerName !== null
                ? t.game.confirmEndDayBlocked
                : t.game.confirmEndDayEmpty,
              { player: blockedPlayerName ?? '', round, nextRound },
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <div className='flex flex-col gap-3'>
            <Button variant='secondary' onClick={onClose}>
              {t.common.cancel}
            </Button>
            <Button variant='dawn' onClick={onConfirm}>
              {t.game.confirmEndDay}
            </Button>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  )
}
