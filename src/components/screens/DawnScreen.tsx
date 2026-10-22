import type { PublicDeathEntry } from '../../lib/publicDeath'
import { useI18n, interpolate } from '../../lib/i18n'
import { Button, Icon } from '../atoms'
import { ScreenFooter } from '../layouts/ScreenFooter'

type Props = {
  deaths: PublicDeathEntry[]
  round: number
  onContinue: () => void
}

export function DawnScreen({ deaths, round, onContinue }: Props) {
  const { t } = useI18n()

  return (
    <div className='min-h-app bg-gradient-to-b from-amber-950 via-orange-950 to-grimoire-dark flex flex-col'>
      {/* Header */}
      <div className='bg-gradient-to-b from-amber-900/40 to-transparent px-4 py-6'>
        <div className='max-w-lg mx-auto text-center'>
          <div className='flex justify-center mb-3'>
            <Icon
              name='sunrise'
              size='4xl'
              className='text-amber-400 text-glow-gold'
            />
          </div>
          <h1 className='font-tarot text-3xl text-parchment-100 tracking-widest-xl uppercase'>
            {t.game.dawnTitle}
          </h1>
          <p className='text-parchment-400 text-sm mt-1'>
            {t.game.night} {round}
          </p>
        </div>
      </div>

      {/* Deaths */}
      <div className='flex-1 flex items-center justify-center px-4 pb-4'>
        <div className='max-w-lg mx-auto w-full'>
          {deaths.length === 0 ? (
            <div className='text-center py-12'>
              <Icon
                name='shield'
                size='3xl'
                className='text-emerald-400/60 mx-auto mb-4'
              />
              <p className='font-tarot text-xl text-parchment-200 tracking-wider'>
                {t.game.dawnNoDeaths}
              </p>
            </div>
          ) : (
            <div className='space-y-4'>
              {deaths.map((player) =>
                player ? (
                  <div
                    key={player.playerId}
                    className='flex items-center gap-4 p-5 rounded-xl bg-red-950/40 border border-red-500/30'
                  >
                    <div className='w-14 h-14 rounded-full bg-red-900/50 border-2 border-red-500/40 flex items-center justify-center flex-shrink-0'>
                      <Icon name='skull' size='xl' className='text-red-400' />
                    </div>
                    <div className='flex-1'>
                      <div className='font-tarot text-xl text-parchment-100 tracking-wider'>
                        {player.playerName}
                      </div>
                      <p className='text-red-400/80 text-sm mt-0.5'>
                        {interpolate(t.game.dawnDeathAnnouncement, {
                          player: player.playerName,
                        })}
                      </p>
                    </div>
                  </div>
                ) : null,
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <ScreenFooter borderColor='border-amber-500/30'>
        <Button onClick={onContinue} fullWidth size='lg' variant='ember'>
          <Icon name='sun' size='md' className='mr-2' />
          {t.game.continueToDay}
        </Button>
      </ScreenFooter>
    </div>
  )
}
