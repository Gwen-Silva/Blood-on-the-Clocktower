import { useRef, useState, type ReactNode } from 'react'
import { Button } from '../atoms'
export function CorrectionConfirmation({
  operationKey,
  action,
  title,
  description,
  restriction,
  error,
  confirm,
  cancel,
  onConfirm,
}: {
  operationKey: string
  action: string
  title: string
  description: ReactNode
  restriction: string
  error: string
  confirm: string
  cancel: string
  onConfirm: () => boolean
}) {
  const [opened, setOpened] = useState<string | null>(null),
    [failed, setFailed] = useState(false)
  const submitting = useRef(false)
  return (
    <section
      className='rounded-xl border border-mystic-gold/30 p-4 mb-4 space-y-3'
      aria-label={title}
    >
      {opened !== operationKey ? (
        <Button
          variant='outline'
          fullWidth
          onClick={() => {
            setOpened(operationKey)
            setFailed(false)
          }}
        >
          {action}
        </Button>
      ) : (
        <>
          <h2 className='font-tarot text-mystic-gold'>{title}</h2>
          {description}
          <p className='text-sm text-parchment-400'>{restriction}</p>
          {failed && (
            <p role='alert' className='text-red-300'>
              {error}
            </p>
          )}
          <Button
            variant='gold'
            fullWidth
            disabled={failed}
            onClick={() => {
              if (submitting.current || failed) return
              submitting.current = true
              try {
                if (onConfirm()) setOpened(null)
                else {
                  setFailed(true)
                  submitting.current = false
                }
              } catch {
                setFailed(true)
                submitting.current = false
              }
            }}
          >
            {confirm}
          </Button>
          <Button
            variant='secondary'
            fullWidth
            onClick={() => {
              setOpened(null)
              setFailed(false)
            }}
          >
            {cancel}
          </Button>
        </>
      )}
    </section>
  )
}
