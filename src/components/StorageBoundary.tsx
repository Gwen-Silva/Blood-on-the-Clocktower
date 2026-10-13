import { Component, useState, type ReactNode } from 'react'
import { GameStorageError } from '../lib/storage'
import { useI18n } from '../lib/i18n'
import { Button } from './atoms/button'

function StorageRecovery({ error }: { error: unknown }) {
  const { t } = useI18n()
  const copy = t.storageRecovery
  const [retryFailed, setRetryFailed] = useState(false)
  const storageError = error instanceof GameStorageError ? error : null

  const downloadBackup = () => {
    if (storageError?.backup === undefined) return
    const url = URL.createObjectURL(
      new Blob([storageError.backup], { type: 'application/json' }),
    )
    const link = document.createElement('a')
    link.href = url
    link.download = `grimorium-recovery-${Date.now()}.json`
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  const retry = () => {
    try {
      storageError?.retry?.()
      window.location.reload()
    } catch {
      setRetryFailed(true)
    }
  }

  return (
    <main className='min-h-app bg-grimoire-dark text-parchment-200 flex items-center justify-center p-6'>
      <div className='max-w-lg space-y-5' role='alert'>
        <h1 className='font-tarot text-2xl text-mystic-gold'>{copy.title}</h1>
        <p>{storageError ? copy[storageError.kind] : copy.unexpected}</p>
        {storageError?.backup !== undefined && (
          <>
            <p>{copy.backupHint}</p>
            <Button onClick={downloadBackup} variant='gold' fullWidth>
              {copy.download}
            </Button>
          </>
        )}
        {retryFailed && <p>{copy.retryFailed}</p>}
        {storageError?.retry ? (
          <Button onClick={retry} variant='secondary' fullWidth>
            {copy.retry}
          </Button>
        ) : (
          <Button
            onClick={() => window.location.reload()}
            variant='secondary'
            fullWidth
          >
            {copy.reload}
          </Button>
        )}
      </div>
    </main>
  )
}

// Render failures arrive here directly. Save failures from event handlers are
// promoted into render by App/GameScreen, without committing the failed change.
export class StorageBoundary extends Component<
  { children: ReactNode },
  { error: unknown }
> {
  state: { error: unknown } = { error: null }
  static getDerivedStateFromError(error: unknown) {
    return { error }
  }
  render() {
    return this.state.error ? (
      <StorageRecovery error={this.state.error} />
    ) : (
      this.props.children
    )
  }
}
