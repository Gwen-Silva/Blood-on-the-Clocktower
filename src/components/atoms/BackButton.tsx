import { Icon } from './icon'
import { cn } from '../../lib/utils'
import { useI18n } from '../../lib/i18n'

type BackButtonProps = {
  onClick: () => void
  label?: string
}

export function BackButton({ onClick, label }: BackButtonProps) {
  const { t } = useI18n()
  return (
    <button
      onClick={onClick}
      type='button'
      aria-label={label ?? t.common.back}
      className={cn(
        'p-3 text-parchment-400 hover:text-parchment-100 transition-colors min-w-[44px] min-h-[44px] shrink-0 flex items-center justify-center',
        label && 'flex items-center gap-1',
      )}
    >
      <Icon name='arrowLeft' size='md' />
      {label && <span className='text-xs'>{label}</span>}
    </button>
  )
}
