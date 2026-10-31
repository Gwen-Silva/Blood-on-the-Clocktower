import { useRef, useState } from 'react'
import { Button } from '../atoms'
import { useI18n, interpolate, getLocale } from '../../lib/i18n'
import { formatGamePhase } from '../../lib/gamePresentation'
import { isAudienceProtected } from '../../lib/audienceProtection'
import {
  createGameBackup,
  previewGameBackup,
  restoreGameBackup,
  backupFile,
  downloadGameBackup,
  type BackupPreview,
  type ConflictChoice,
} from '../../lib/gameBackup'

export function BackupScreen({ onBack }: { onBack: () => void }) {
  const { t, language } = useI18n()
  const copy = t.backup
  const [preview, setPreview] = useState<BackupPreview | null>(null)
  const [choices, setChoices] = useState<Record<string, ConflictChoice>>({})
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const generation = useRef(0)
  const saving = useRef(false)
  const conflicts =
    preview?.games.filter((game) =>
      preview.existing.some((old) => old.id === game.id),
    ) ?? []
  const cancel = () => {
    generation.current++
    setPreview(null)
    setChoices({})
    setMessage('')
  }
  const exportBackup = (share: boolean) => {
    try {
      const file = backupFile(createGameBackup())
      if (share && navigator.canShare?.({ files: [file] })) {
        // Call synchronously from the user gesture for mobile Web Share.
        void navigator
          .share({ files: [file], title: copy.title })
          .then(() => setMessage(copy.created))
          .catch((error) => {
            if (error?.name !== 'AbortError') setMessage(copy.shareError)
          })
      } else {
        downloadGameBackup(file)
        setMessage(copy.created)
      }
    } catch {
      setMessage(copy.exportError)
    }
  }
  const readFile = async (file: File | undefined) => {
    cancel()
    if (!file) return
    const request = ++generation.current
    setBusy(true)
    try {
      const raw = await file.text()
      if (request !== generation.current) return
      const result = previewGameBackup(raw)
      if (isAudienceProtected()) throw new Error('Protected')
      setPreview(result)
    } catch {
      if (request === generation.current) setMessage(copy.invalid)
    } finally {
      if (request === generation.current) setBusy(false)
    }
  }
  const confirm = () => {
    if (!preview || saving.current) return
    saving.current = true
    try {
      restoreGameBackup(preview, choices)
      cancel()
      setMessage(copy.restored)
    } catch {
      cancel()
      setMessage(copy.saveError)
    } finally {
      saving.current = false
    }
  }
  return (
    <main className='max-w-lg mx-auto w-full p-4 space-y-5 text-parchment-200'>
      <Button
        variant='secondary'
        onClick={() => {
          cancel()
          onBack()
        }}
      >
        {t.common.back}
      </Button>
      <h1 className='font-tarot text-2xl text-mystic-gold'>{copy.title}</h1>
      <p className='p-4 rounded-xl border border-mystic-gold/30 bg-mystic-gold/5'>
        {copy.secret}
      </p>
      <div className='flex flex-wrap gap-3'>
        <Button variant='gold' onClick={() => exportBackup(false)}>
          {copy.download}
        </Button>
        <Button variant='secondary' onClick={() => exportBackup(true)}>
          {copy.share}
        </Button>
      </div>
      <h2 className='font-tarot text-xl'>{copy.restore}</h2>
      <label className='block space-y-2'>
        <span>{copy.file}</span>
        <input
          className='block w-full min-h-11 text-sm file:mr-3 file:p-3 file:rounded-lg file:border-0 file:bg-grimoire-purple file:text-parchment-100'
          type='file'
          accept='.json,application/json'
          disabled={busy}
          onChange={(event) => {
            const file = event.currentTarget.files?.[0]
            event.currentTarget.value = ''
            void readFile(file)
          }}
        />
      </label>
      {message && <p role='status'>{message}</p>}
      {preview && (
        <section aria-label={copy.restore} className='space-y-4'>
          <h3>{interpolate(copy.found, { count: preview.games.length })}</h3>
          {!preview.games.length && <p>{copy.empty}</p>}
          {preview.games.map((game) => {
            const state = game.history.at(-1)!.stateAfter
            const conflict = conflicts.some((item) => item.id === game.id)
            return (
              <article
                key={game.id}
                className='rounded-xl p-4 border border-parchment-500/20 bg-grimoire-dark space-y-2 break-words'
              >
                <h4 className='font-bold'>{game.name}</h4>
                <p className='text-sm text-parchment-400'>
                  {new Date(game.createdAt).toLocaleString(getLocale(language))}{' '}
                  · {state.players.length} {t.common.players.toLowerCase()} ·{' '}
                  {formatGamePhase(
                    {
                      id: game.id,
                      name: game.name,
                      createdAt: game.createdAt,
                      playerCount: state.players.length,
                      phase: state.phase,
                      round: state.round,
                    },
                    t,
                  )}
                </p>
                {conflict && (
                  <>
                    <p>{copy.conflict}</p>
                    <label className='block space-y-2'>
                      <span>{copy.choose}</span>
                      <select
                        className='block w-full min-h-11 rounded-lg bg-grimoire-purple text-parchment-100 p-2'
                        value={
                          Object.hasOwn(choices, game.id)
                            ? choices[game.id]
                            : ''
                        }
                        onChange={(event) =>
                          setChoices((previous) => ({
                            ...previous,
                            [game.id]: event.target.value as ConflictChoice,
                          }))
                        }
                      >
                        <option value='' disabled>
                          {copy.select}
                        </option>
                        <option value='replace'>{copy.replace}</option>
                        <option value='both'>{copy.both}</option>
                      </select>
                    </label>
                  </>
                )}
              </article>
            )
          })}
          {!!preview.games.length && (
            <>
              <p>{copy.question}</p>
              <Button
                variant='gold'
                fullWidth
                disabled={conflicts.some(
                  (game) => !Object.hasOwn(choices, game.id),
                )}
                onClick={confirm}
              >
                {copy.confirm}
              </Button>
            </>
          )}
          <Button variant='secondary' fullWidth onClick={cancel}>
            {t.common.cancel}
          </Button>
        </section>
      )}
    </main>
  )
}
