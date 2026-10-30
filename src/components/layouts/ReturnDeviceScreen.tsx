import { useI18n } from '../../lib/i18n'
import { Button, Icon } from '../atoms'
import { useHandbackHold } from './useHandbackHold'

type Props = {
  onReady: () => void
}

export function ReturnDeviceScreen({ onReady }: Props) {
  const { t } = useI18n()
  const { progress, handlers } = useHandbackHold(onReady)

  return (
    <div className='min-h-app bg-gradient-to-b from-grimoire-purple via-grimoire-dark to-grimoire-darker flex flex-col items-center justify-center px-6'>
      <div className='text-center max-w-sm'>
        <div className='mb-6'>
          <Icon
            name='shield'
            size='4xl'
            className='text-mystic-gold/80 mx-auto'
          />
        </div>
        <h1 className='font-tarot text-2xl text-parchment-100 tracking-widest-xl uppercase mb-3'>
          {t.game.returnDeviceToNarrator}
        </h1>
        <p
          id='handback-instruction'
          className='text-parchment-500 text-sm mb-10'
        >
          {t.game.returnDeviceDescription}
        </p>
        <Button
          {...handlers}
          type='button'
          size='lg'
          variant='gold'
          fullWidth
          className='relative overflow-hidden whitespace-normal h-auto min-h-14 select-none touch-none'
          style={{ WebkitTouchCallout: 'none', WebkitUserSelect: 'none' }}
          aria-describedby='handback-instruction handback-hold-hint'
        >
          <span
            aria-hidden='true'
            className='absolute inset-y-0 left-0 bg-white/30 pointer-events-none'
            style={{ width: `${progress * 100}%` }}
          />
          <Icon name='check' size='md' className='mr-2' />
          <span className='relative'>{t.game.returnDeviceReady}</span>
        </Button>
        <p
          id='handback-hold-hint'
          role='status'
          className='text-parchment-400 text-sm mt-2'
        >
          {progress === 1
            ? t.game.returnDeviceComplete
            : t.game.returnDeviceHoldHint}
        </p>
      </div>
    </div>
  )
}
