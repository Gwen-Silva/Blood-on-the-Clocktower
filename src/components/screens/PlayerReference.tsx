import type { PublicGameState } from '../../lib/publicGameState'
import { useI18n } from '../../lib/i18n'
import { useHandback } from '../context/PlayerFacingContext'
import { Button } from '../atoms'
import { RolesLibrary } from './RolesLibrary'

type Props = {
  scriptId: PublicGameState['scriptId']
  onReturnToStoryteller: () => void
}

/** Static public catalog; must live within the shared protected audience lifecycle. */
export function PlayerReference({ scriptId, onReturnToStoryteller }: Props) {
  const { t } = useI18n()
  const { requestHandback } = useHandback()
  const requestReturn = () => requestHandback(onReturnToStoryteller)

  if (scriptId !== 'trouble-brewing' && scriptId !== 'custom') {
    return (
      <div className='min-h-app bg-grimoire-dark text-parchment-100 flex flex-col items-center justify-center p-6 gap-6'>
        <h1 className='font-tarot text-xl'>{t.playerReference.title}</h1>
        <p>{t.playerReference.unavailable}</p>
        <Button onClick={requestReturn}>
          {t.playerReference.returnToStoryteller}
        </Button>
      </div>
    )
  }

  return (
    <RolesLibrary
      scriptId={scriptId}
      mode='player'
      title={t.playerReference.title}
      introduction={t.playerReference.introduction}
      backLabel={t.playerReference.returnToStoryteller}
      onBack={requestReturn}
    />
  )
}
