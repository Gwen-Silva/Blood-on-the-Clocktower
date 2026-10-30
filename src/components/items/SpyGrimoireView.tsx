import { useState } from 'react'
import type { GameState } from '../../lib/types'
import { useI18n, getEffectName, getEffectDescription } from '../../lib/i18n'
import { getEffect } from '../../lib/effects'
import { BackButton } from '../atoms'
import { RoleCard } from './RoleCard'
import { Grimoire } from './Grimoire'
import { HandbackButton, NightActionLayout } from '../layouts'
import { useHandback } from '../context/PlayerFacingContext'
import { useBackButton } from '../../hooks/useBackButton'

/** Authorized Spy information only; no modal, mutation or Storyteller controls. */
export function SpyGrimoireView({
  state,
  playerId,
  onComplete,
}: {
  state: GameState
  playerId: string
  onComplete: () => void
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const { t, language } = useI18n()
  const { requestHandback } = useHandback()
  const selected = state.players.find((p) => p.id === selectedId)
  const actor = state.players.find((p) => p.id === playerId)!
  useBackButton(() =>
    selectedId ? setSelectedId(null) : requestHandback(onComplete),
  )
  if (selected)
    return (
      <div className='min-h-app bg-grimoire-dark text-parchment-100 flex flex-col'>
        <header className='screen-navigation px-4 shrink-0'>
          <BackButton
            label={t.clarity.spyBack}
            onClick={() => setSelectedId(null)}
          />
        </header>
        <div className='flex-1 overflow-y-auto px-4 pb-6'>
          <h1 className='font-tarot text-xl text-center my-4'>
            {selected.name}
          </h1>
          <RoleCard roleId={selected.roleId} />
          <section
            aria-label={t.ui.effects}
            className='max-w-sm mx-auto my-4 space-y-3'
          >
            {selected.effects.map((effect, i) => {
              const Description = getEffect(effect.type)?.Description
              return (
                <div
                  key={`${effect.type}-${i}`}
                  className='rounded-lg bg-white/5 p-3 text-sm'
                >
                  <h2 className='font-medium'>
                    {getEffectName(effect.type, language)}
                  </h2>
                  {Description ? (
                    <Description instance={effect} language={language} />
                  ) : (
                    <p>{getEffectDescription(effect.type, language)}</p>
                  )}
                </div>
              )
            })}
          </section>
        </div>
      </div>
    )
  return (
    <NightActionLayout
      player={actor}
      title={t.game.grimoire}
      description={t.clarity.spyInspect}
    >
      <Grimoire state={state} onPlayerSelect={(p) => setSelectedId(p.id)} />
      <HandbackButton onClick={onComplete} fullWidth className='mt-4'>
        {t.common.continue}
      </HandbackButton>
    </NightActionLayout>
  )
}
