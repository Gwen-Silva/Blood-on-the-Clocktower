import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { useI18n, interpolate } from '../../lib/i18n'
import { isAudienceProtected } from '../../lib/audienceProtection'
import {
  activateWaitingUpdate,
  checkForUpdate,
  hasWaitingUpdate,
  subscribeToUpdate,
} from '../../lib/pwaUpdate'
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
} from '../atoms'

/** Only mounted on the home/setup route. Never overlays player or game screens. */
export function AboutAndUpdates({
  allowActivation,
}: {
  allowActivation: boolean
}) {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState<'check' | 'activate' | null>(null)
  const [message, setMessage] = useState<'offline' | 'closeWindows' | null>(
    null,
  )
  const waiting = useSyncExternalStore(subscribeToUpdate, hasWaitingUpdate)
  const requested = useRef(false)
  const allowed = useRef(allowActivation)
  allowed.current = allowActivation
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return
    const changed = () => {
      // Never reload a newly entered setup or a protected audience screen.
      if (!requested.current || !allowed.current) return
      try {
        if (!isAudienceProtected()) window.location.reload()
      } catch {
        /* Keep the privacy boundary. */
      }
    }
    navigator.serviceWorker.addEventListener('controllerchange', changed)
    return () =>
      navigator.serviceWorker.removeEventListener('controllerchange', changed)
  }, [])
  const check = async () => {
    setBusy('check')
    setMessage(null)
    try {
      await checkForUpdate()
    } catch {
      setMessage('offline')
    } finally {
      setBusy(null)
    }
  }
  const activate = async () => {
    if (busy || !allowed.current) return
    try {
      if (isAudienceProtected()) {
        setMessage('closeWindows')
        return
      }
    } catch {
      setMessage('closeWindows')
      return
    }
    requested.current = true
    setBusy('activate')
    setMessage(null)
    try {
      if (!(await activateWaitingUpdate())) {
        requested.current = false
        setMessage('closeWindows')
        setBusy(null)
      }
    } catch {
      requested.current = false
      setMessage('offline')
      setBusy(null)
    }
  }
  return (
    <>
      <Button
        variant='ghost'
        size='sm'
        className='min-h-11'
        onClick={() => setOpen(true)}
      >
        {t.about.title}
      </Button>
      <Dialog
        open={open}
        onOpenChange={(value) => {
          if (!busy) setOpen(value)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.about.title}</DialogTitle>
            <DialogDescription>{t.about.safe}</DialogDescription>
          </DialogHeader>
          <DialogBody>
            <p
              data-build-sha={__BUILD_SHA__}
              className='font-mono text-sm text-mystic-gold'
            >
              {interpolate(t.about.version, { sha: __BUILD_SHA__.slice(0, 7) })}
            </p>
            <p className='text-sm my-3'>
              {waiting ? t.about.available : t.about.current}
            </p>
            <p className='text-xs text-parchment-400 mb-4'>
              {t.about.lifecycle}
            </p>
            {message && (
              <p role='status' className='text-sm text-amber-300 mb-3'>
                {t.about[message]}
              </p>
            )}
            {!allowActivation && (
              <p className='text-sm mb-3'>{t.about.finishSetup}</p>
            )}
            <div className='flex flex-col gap-3'>
              {waiting && (
                <Button
                  onClick={activate}
                  disabled={!!busy || !allowActivation}
                >
                  {busy === 'activate' ? t.about.activating : t.about.activate}
                </Button>
              )}
              <Button variant='secondary' onClick={check} disabled={!!busy}>
                {busy === 'check' ? t.about.checking : t.about.check}
              </Button>
              <Button
                variant='ghost'
                onClick={() => setOpen(false)}
                disabled={!!busy}
              >
                {t.ui.close}
              </Button>
            </div>
          </DialogBody>
        </DialogContent>
      </Dialog>
    </>
  )
}
