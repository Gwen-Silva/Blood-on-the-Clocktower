import { AudienceRecoveryBoundary } from '../layouts/AudienceRecoveryBoundary'
import { useState, useCallback, useMemo, useRef } from 'react'
import { isAudienceProtected } from '../../lib/audienceProtection'
import { Game, getCurrentState, getPlayer, PlayerState } from '../../lib/types'
import { getRole } from '../../lib/roles'
import { getTeam } from '../../lib/teams'
import { RoleCard } from '../items/RoleCard'
import { TeamBackground, CardLink } from '../items/TeamBackground'
import {
  markRoleRevealed,
  getRoleRevelationProgress,
  startNight,
  startDay,
  applyNightAction,
  skipNightAction,
  resolveNomination,
  resolveVote,
  executeAtEndOfDay,
  endGame,
  checkWinCondition,
  checkEndOfDayWinConditions,
  addEffectToPlayer,
  removeEffectFromPlayer,
  updateEffectData,
  processAutoSkips,
  applySetupAction,
  getLastNightDeaths,
  getNominatorsToday,
  getNomineesToday,
  getBlockStatus,
  getVoteBenchmark,
  hasVirginExecutionToday,
  finishVirginExecutionDay,
  EvilStartingInfoStatus,
} from '../../lib/game'
import { isAlive } from '../../lib/types'
import {
  resolveIntent,
  applyPipelineChanges,
  getAvailableDayActions,
} from '../../lib/pipeline'
import {
  PipelineResult,
  PipelineInputProps,
  AvailableDayAction,
  AvailableNightFollowUp,
  NightFollowUpResult,
  DayActionResult,
} from '../../lib/pipeline/types'
import { saveGame } from '../../lib/storage'
import {
  resolveGameAction,
  resolveNightAction,
  type GameAction,
} from '../../lib/gameAction'
import { useI18n } from '../../lib/i18n'
import { RoleRevelationScreen } from './RoleRevelationScreen'
import { NightDashboard } from './NightDashboard'
import { DayPhase } from './DayPhase'
import { NominationScreen } from './NominationScreen'
import { VotingPhase } from './VotingPhase'
import { GameOver } from './GameOver'
import { HistoryView } from './HistoryView'
import { GrimoireModal, type GrimoireIntent } from '../items/GrimoireModal'
import { Icon, LanguagePicker } from '../atoms'
import { NightActionResult, SetupActionResult } from '../../lib/roles/types'
import type { FC } from 'react'
import { SetupActionsScreen } from './SetupActionsScreen'
import { DawnScreen } from './DawnScreen'
import { EvilStartingInfoScreen } from './EvilStartingInfoScreen'
import { DeathRevealScreen, DeathRevealEntry } from './DeathRevealScreen'
import { PlayerFacingContext } from '../context/PlayerFacingContext'
import { PlayerFacingScreen } from '../layouts/PlayerFacingScreen'

type Props = {
  initialGame: Game
  onMainMenu: () => void
}

type Screen =
  | { type: 'setup_actions' }
  | { type: 'setup_action'; playerId: string; roleId: string }
  | { type: 'role_revelation' }
  | { type: 'showing_role'; playerId: string }
  | { type: 'night_dashboard' }
  | { type: 'starting_info'; status: EvilStartingInfoStatus }
  | { type: 'night_action'; playerId: string; roleId: string }
  | { type: 'night_follow_up'; followUp: AvailableNightFollowUp }
  | { type: 'dawn'; deaths: string[]; round: number }
  | { type: 'day' }
  | { type: 'nomination' }
  | { type: 'day_action'; action: AvailableDayAction }
  | { type: 'voting'; nomineeId: string }
  | { type: 'pipeline_input' }
  | { type: 'game_over' }
  | { type: 'death_reveal'; deaths: DeathRevealEntry[]; next: Screen }
  | { type: 'grimoire_role_card'; playerId: string; returnTo: Screen }

export function GameScreen(props: Props) {
  return (
    <AudienceRecoveryBoundary>
      <GameScreenContent {...props} />
    </AudienceRecoveryBoundary>
  )
}

function GameScreenContent({ initialGame, onMainMenu }: Props) {
  const { t } = useI18n()
  const [game, setGame] = useState<Game>(initialGame)
  const [screen, setScreen] = useState<Screen>(() =>
    getInitialScreen(initialGame),
  )
  const firstNightStarted = useRef(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showGrimoire, setShowGrimoire] = useState(false)
  const [grimoireIntent, setGrimoireIntent] = useState<GrimoireIntent>({
    view: 'list',
  })

  // Pipeline UI state — shown when an intent needs narrator input mid-resolution
  const [pipelineUI, setPipelineUI] = useState<{
    Component: FC<PipelineInputProps>
    intent: import('../../lib/pipeline/types').Intent
    state: import('../../lib/types').GameState
    onResult: (result: unknown) => void
  } | null>(null)

  // Player-facing state — set by PlayerFacingScreen wrapper inside NightAction components
  const [isPlayerFacing, setIsPlayerFacing] = useState(false)
  const setPlayerFacing = useCallback((value: boolean) => {
    setIsPlayerFacing(value)
    if (value) {
      setShowHistory(false)
      setShowGrimoire(false)
    }
  }, [])
  const playerFacingCtx = useMemo(
    () => ({ setPlayerFacing }),
    [setPlayerFacing],
  )

  const [saveError, setSaveError] = useState<unknown>(null)

  const state = getCurrentState(game)

  const updateGame = useCallback((newGame: Game) => {
    try {
      saveGame(newGame)
      setGame(newGame)
      return true
    } catch (error) {
      setSaveError(error)
      return false
    }
  }, [])

  // ========================================================================
  // PIPELINE INTEGRATION
  // ========================================================================

  /**
   * Process a pipeline result. If resolved/prevented, apply changes.
   * If needs_input, show the pipeline's UI component.
   * Only complete actions are saved; pending choices stay provisional.
   */
  const processGameAction = useCallback(
    (action: GameAction, afterComplete: (updatedGame: Game) => void) => {
      if (action.type === 'complete') {
        if (!updateGame(action.game)) return
        setPipelineUI(null)
        afterComplete(action.game)
      } else {
        setPipelineUI({
          Component: action.Component,
          intent: action.intent,
          state: action.state,
          onResult: (answer: unknown) => {
            processGameAction(action.resume(answer), afterComplete)
          },
        })
        setScreen({ type: 'pipeline_input' })
      }
    },
    [updateGame],
  )

  if (saveError) throw saveError

  const processPipelineResult = (
    result: PipelineResult,
    currentGame: Game,
    afterComplete: (updatedGame: Game) => void,
  ) => processGameAction(resolveGameAction(currentGame, result), afterComplete)

  // ========================================================================
  // ROLE REVELATION FLOW
  // ========================================================================

  const handleRevealRole = (playerId: string) => {
    setScreen({ type: 'showing_role', playerId })
  }

  const handleRoleRevealDismiss = () => {
    if (screen.type !== 'showing_role') return

    const newGame = markRoleRevealed(game, screen.playerId)
    if (newGame !== game && !updateGame(newGame)) return
    setScreen({ type: 'role_revelation' })
  }

  const handleStartFirstNight = (confirmedSkip = false) => {
    if (
      screen.type !== 'role_revelation' ||
      state.phase !== 'setup' ||
      isPlayerFacing ||
      isAudienceProtected() ||
      firstNightStarted.current
    )
      return
    if (!confirmedSkip && !getRoleRevelationProgress(game).allRevealed) return
    firstNightStarted.current = true
    const nightGame = startNight(game)
    // Process auto-skips so the dashboard is ready
    const readyGame = processAutoSkips(nightGame)
    if (!updateGame(readyGame)) return
    setScreen({ type: 'night_dashboard' })
  }

  // ========================================================================
  // SETUP ACTIONS FLOW
  // ========================================================================

  const handleOpenSetupAction = (playerId: string, roleId: string) => {
    setScreen({ type: 'setup_action', playerId, roleId })
  }

  const handleSetupActionComplete = (result: SetupActionResult) => {
    if (screen.type !== 'setup_action') return

    const newGame = applySetupAction(game, screen.playerId, result)
    if (!updateGame(newGame)) return
    setScreen({ type: 'setup_actions' })
  }

  const handleSetupActionsContinue = () => {
    setScreen({ type: 'role_revelation' })
  }

  // ========================================================================
  // NIGHT DASHBOARD FLOW
  // ========================================================================

  const handleOpenNightAction = (playerId: string, roleId: string) => {
    const player = getPlayer(state, playerId)
    if (!player) return

    const role = getRole(roleId)
    if (!role || !role.NightAction) {
      // Role has no night action component — auto-skip
      const newGame = skipNightAction(game, roleId, playerId)
      const readyGame = processAutoSkips(newGame)
      if (!updateGame(readyGame)) return
      setScreen({ type: 'night_dashboard' })
      return
    }

    setScreen({ type: 'night_action', playerId, roleId })
  }

  const handleOpenStartingInfo = (status: EvilStartingInfoStatus) => {
    setScreen({ type: 'starting_info', status })
  }

  const handleStartingInfoComplete = (result: NightActionResult) => {
    const newGame = applyNightAction(game, result)
    if (!updateGame(newGame)) return
    setScreen({ type: 'night_dashboard' })
  }

  const handleOpenNightFollowUp = (followUp: AvailableNightFollowUp) => {
    setScreen({ type: 'night_follow_up', followUp })
  }

  const handleNightActionComplete = (result: NightActionResult) => {
    if (screen.type !== 'night_action') return

    processGameAction(resolveNightAction(game, result), (newGame) => {
      const winner = checkWinCondition(getCurrentState(newGame), newGame)
      if (winner) {
        const finalGame = endGame(newGame, winner)
        if (!updateGame(finalGame)) return
        setScreen({ type: 'game_over' })
      } else {
        const readyGame = processAutoSkips(newGame)
        if (!updateGame(readyGame)) return
        setScreen({ type: 'night_dashboard' })
      }
    })
  }

  const handleNightActionSkip = () => {
    if (screen.type !== 'night_action') return

    const newGame = skipNightAction(game, screen.roleId, screen.playerId)
    const readyGame = processAutoSkips(newGame)
    if (!updateGame(readyGame)) return
    setScreen({ type: 'night_dashboard' })
  }

  const handleStartDay = () => {
    const newGame = startDay(game)
    if (!updateGame(newGame)) return

    const winner = checkWinCondition(getCurrentState(newGame), newGame)
    if (winner) {
      const finalGame = endGame(newGame, winner)
      if (!updateGame(finalGame)) return
      setScreen({ type: 'game_over' })
    } else {
      const deaths = getLastNightDeaths(newGame)
      const deadPlayers = deaths
        .map((id) => state.players.find((p) => p.id === id))
        .filter(Boolean)
        .map((p) => ({
          playerId: p!.id,
          playerName: p!.name,
          roleId: p!.roleId,
        }))

      if (deadPlayers.length > 0) {
        // Death reveal goes straight to day — dawn announcement is redundant
        setScreen({
          type: 'death_reveal',
          deaths: deadPlayers,
          next: { type: 'day' },
        })
      } else {
        // No deaths: show dawn screen with "no one died" message
        setScreen({ type: 'dawn', deaths, round: state.round })
      }
    }
  }

  const handleDawnContinue = () => {
    setScreen({ type: 'day' })
  }

  // ========================================================================
  // DAY FLOW
  // ========================================================================

  const handleOpenNomination = () => {
    setScreen({ type: 'nomination' })
  }

  const handleNominate = (nominatorId: string, nomineeId: string) => {
    const result = resolveNomination(game, nominatorId, nomineeId)
    if (!result) return

    processPipelineResult(result, game, (newGame) => {
      const newState = getCurrentState(newGame)
      const winner = checkWinCondition(newState, newGame)
      if (winner) {
        const finalGame = endGame(newGame, winner)
        if (!updateGame(finalGame)) return
        setScreen({ type: 'game_over' })
      } else {
        const oldPlayerSet = new Set(
          state.players.filter(isAlive).map((p) => p.id),
        )
        const newPlayerSet = new Set(
          newState.players.filter(isAlive).map((p) => p.id),
        )
        const deaths = Array.from(oldPlayerSet).filter(
          (id) => !newPlayerSet.has(id),
        )
        const virginTriggered = newGame.history
          .slice(game.history.length)
          .some((entry) => entry.type === 'virgin_execution')

        if (virginTriggered && deaths.length > 0) {
          const deadPlayers = deaths
            .map((id) => newState.players.find((p) => p.id === id))
            .filter(Boolean)
            .map((p) => ({
              playerId: p!.id,
              playerName: p!.name,
              roleId: p!.roleId,
            }))
          const nightGame = finishVirginExecutionDay(newGame)
          if (!updateGame(nightGame)) return
          setScreen({
            type: 'death_reveal',
            deaths: deadPlayers,
            next: { type: 'night_dashboard' },
          })
        } else {
          setScreen({ type: 'voting', nomineeId })
        }
      }
    })
  }

  const handleVoteComplete = (voteCount: number, votedIds?: string[]) => {
    if (screen.type !== 'voting') return

    const newGame = resolveVote(game, screen.nomineeId, voteCount, votedIds)
    if (!updateGame(newGame)) return

    // No execution here — deferred to end of day
    setScreen({ type: 'day' })
  }

  const handleEndDay = () => {
    // Check who is alive before execution
    const preExecAliveIds = new Set(
      state.players
        .filter((p) => !p.effects.some((e) => e.type === 'dead'))
        .map((p) => p.id),
    )

    // Execute whoever is on the block (deferred execution)
    let currentGame = executeAtEndOfDay(game)

    // Check who is alive after
    const postState = getCurrentState(currentGame)
    const postExecAliveIds = new Set(
      postState.players
        .filter((p) => !p.effects.some((e) => e.type === 'dead'))
        .map((p) => p.id),
    )
    const deaths = Array.from(preExecAliveIds).filter(
      (id) => !postExecAliveIds.has(id),
    )

    // Check win conditions after execution
    const postExecWinner = checkWinCondition(postState, currentGame)
    if (postExecWinner) {
      const finalGame = endGame(currentGame, postExecWinner)
      if (!updateGame(finalGame)) return
      setScreen({ type: 'game_over' })
      return
    }

    // Check dynamic end-of-day win conditions (e.g., Mayor's peaceful victory)
    const endOfDayWinner = checkEndOfDayWinConditions(postState, currentGame)
    if (endOfDayWinner) {
      const finalGame = endGame(currentGame, endOfDayWinner)
      if (!updateGame(finalGame)) return
      setScreen({ type: 'game_over' })
      return
    }

    const newGame = startNight(currentGame)
    // Process auto-skips so the dashboard is ready
    const readyGame = processAutoSkips(newGame)
    if (!updateGame(readyGame)) return

    const nightDashboardScreen: Screen = { type: 'night_dashboard' }

    if (deaths.length > 0) {
      const deadPlayers = deaths
        .map((id) => postState.players.find((p) => p.id === id))
        .filter(Boolean)
        .map((p) => ({
          playerId: p!.id,
          playerName: p!.name,
          roleId: p!.roleId,
        }))
      setScreen({
        type: 'death_reveal',
        deaths: deadPlayers,
        next: nightDashboardScreen,
      })
    } else {
      setScreen(nightDashboardScreen)
    }
  }

  const handleCancelVote = () => {
    setScreen({ type: 'day' })
  }

  const handleBackFromNomination = () => {
    setScreen({ type: 'day' })
  }

  // ========================================================================
  // GENERIC DAY ACTIONS
  // ========================================================================

  const handleOpenDayAction = (action: AvailableDayAction) => {
    setScreen({ type: 'day_action', action })
  }

  const handleDayActionComplete = (result: DayActionResult) => {
    const changes = {
      entries: result.entries,
      addEffects: result.addEffects,
      removeEffects: result.removeEffects,
    }
    const directGame = applyPipelineChanges(game, changes)

    const finishDayAction = (newGame: Game) => {
      const newState = getCurrentState(newGame)
      const winner = checkWinCondition(newState, newGame)
      if (winner) {
        const finalGame = endGame(newGame, winner)
        if (!updateGame(finalGame)) return
        setScreen({ type: 'game_over' })
        return
      }

      const oldPlayerSet = new Set(
        state.players.filter(isAlive).map((p) => p.id),
      )
      const newPlayerSet = new Set(
        newState.players.filter(isAlive).map((p) => p.id),
      )
      const deaths = Array.from(oldPlayerSet).filter(
        (id) => !newPlayerSet.has(id),
      )

      const nextScreen: Screen = { type: 'day' }

      if (deaths.length > 0) {
        const deadPlayers = deaths
          .map((id) => newState.players.find((p) => p.id === id))
          .filter(Boolean)
          .map((p) => ({
            playerId: p!.id,
            playerName: p!.name,
            roleId: p!.roleId,
          }))
        setScreen({
          type: 'death_reveal',
          deaths: deadPlayers,
          next: nextScreen,
        })
      } else {
        setScreen(nextScreen)
      }
    }

    if (result.intent) {
      const pipelineResult = resolveIntent(
        result.intent,
        getCurrentState(directGame),
        directGame,
      )
      processPipelineResult(pipelineResult, directGame, finishDayAction)
    } else {
      if (!updateGame(directGame)) return
      finishDayAction(directGame)
    }
  }

  const handleBackFromDayAction = () => {
    setScreen({ type: 'day' })
  }

  // ========================================================================
  // NIGHT FOLLOW-UPS
  // ========================================================================

  const handleNightFollowUpComplete = (result: NightFollowUpResult) => {
    const changes = {
      entries: result.entries,
      addEffects: result.addEffects,
      removeEffects: result.removeEffects,
    }
    const newGame = applyPipelineChanges(game, changes)
    if (!updateGame(newGame)) return
    setScreen({ type: 'night_dashboard' })
  }

  // ========================================================================
  // OTHER HANDLERS
  // ========================================================================

  const handleOpenEditEffects = (player: PlayerState) => {
    setGrimoireIntent({ view: 'edit_effects', player })
    setShowGrimoire(true)
  }

  const handleAddEffect = (
    playerId: string,
    effectType: string,
    data?: Record<string, unknown>,
  ) => {
    const newGame = addEffectToPlayer(game, playerId, effectType, data)
    if (!updateGame(newGame)) return
  }

  const handleRemoveEffect = (playerId: string, effectType: string) => {
    const newGame = removeEffectFromPlayer(game, playerId, effectType)
    if (!updateGame(newGame)) return
  }

  const handleUpdateEffect = (
    playerId: string,
    effectType: string,
    data: Record<string, unknown>,
  ) => {
    const newGame = updateEffectData(game, playerId, effectType, data)
    if (!updateGame(newGame)) return
  }

  const handleShowRoleCard = (player: PlayerState) => {
    setShowGrimoire(false)
    setScreen({
      type: 'grimoire_role_card',
      playerId: player.id,
      returnTo: screen,
    })
  }

  const handleRoleCardClose = () => {
    if (screen.type === 'grimoire_role_card') {
      setScreen(screen.returnTo)
    }
  }

  // ========================================================================
  // RENDER
  // ========================================================================

  if (showHistory && !isPlayerFacing) {
    return (
      <div className='relative'>
        <HistoryView game={game} onClose={() => setShowHistory(false)} />
        <div className='fixed top-4 right-4 z-50'>
          <LanguagePicker variant='floating' />
        </div>
      </div>
    )
  }

  const renderScreen = () => {
    switch (screen.type) {
      case 'setup_actions':
        return (
          <SetupActionsScreen
            game={game}
            state={state}
            onOpenSetupAction={handleOpenSetupAction}
            onContinue={handleSetupActionsContinue}
            onShowRoleCard={handleShowRoleCard}
            onEditEffects={handleOpenEditEffects}
          />
        )

      case 'setup_action': {
        const setupPlayer = getPlayer(state, screen.playerId)
        if (!setupPlayer) return null
        const setupRole = getRole(screen.roleId)
        if (!setupRole?.SetupAction) return null

        return (
          <setupRole.SetupAction
            player={setupPlayer}
            state={state}
            onComplete={handleSetupActionComplete}
          />
        )
      }

      case 'role_revelation':
        return (
          <RoleRevelationScreen
            game={game}
            state={state}
            onRevealRole={handleRevealRole}
            onStartNight={() => handleStartFirstNight()}
            onSkipRevelation={() => handleStartFirstNight(true)}
            onMainMenu={onMainMenu}
          />
        )

      case 'showing_role': {
        const player = getPlayer(state, screen.playerId)
        if (!player) return null
        const role = getRole(player.roleId)
        if (!role) return null

        return (
          <PlayerFacingScreen playerName={player.name}>
            <role.RoleReveal
              player={player}
              onContinue={handleRoleRevealDismiss}
            />
          </PlayerFacingScreen>
        )
      }

      case 'night_dashboard':
        return (
          <NightDashboard
            game={game}
            state={state}
            onOpenStartingInfo={handleOpenStartingInfo}
            onOpenNightAction={handleOpenNightAction}
            onOpenNightFollowUp={handleOpenNightFollowUp}
            onStartDay={handleStartDay}
            onMainMenu={onMainMenu}
            onShowRoleCard={handleShowRoleCard}
            onEditEffects={handleOpenEditEffects}
            onOpenGrimoirePlayer={(player) => {
              setGrimoireIntent({ view: 'player_detail', player })
              setShowGrimoire(true)
            }}
          />
        )

      case 'starting_info': {
        const player = getPlayer(state, screen.status.playerId)
        if (!player) return null
        return (
          <EvilStartingInfoScreen
            game={game}
            state={state}
            player={player}
            kind={screen.status.kind}
            onComplete={handleStartingInfoComplete}
          />
        )
      }

      case 'night_follow_up': {
        const FollowUpComponent = screen.followUp.ActionComponent
        return (
          <FollowUpComponent
            state={state}
            game={game}
            playerId={screen.followUp.playerId}
            onComplete={handleNightFollowUpComplete}
          />
        )
      }

      case 'night_action': {
        const player = getPlayer(state, screen.playerId)
        if (!player) return null
        const role = getRole(screen.roleId)
        if (!role) return null

        if (!role.NightAction) {
          handleNightActionSkip()
          return null
        }

        return (
          <role.NightAction
            game={game}
            state={state}
            player={player}
            onComplete={handleNightActionComplete}
            onOpenGrimoire={(intent, readOnly) => {
              setGrimoireIntent({ ...intent, readOnly })
              setShowGrimoire(true)
            }}
          />
        )
      }

      case 'dawn':
        return (
          <DawnScreen
            state={state}
            deaths={screen.deaths}
            round={screen.round}
            onContinue={handleDawnContinue}
          />
        )

      case 'death_reveal':
        return (
          <DeathRevealScreen
            deaths={screen.deaths}
            onContinue={() => setScreen(screen.next)}
          />
        )

      case 'day': {
        // Collect available day actions from active effects
        const dayActions = getAvailableDayActions(state, t)
        const deaths = getLastNightDeaths(game)

        return (
          <DayPhase
            state={state}
            blockStatus={getBlockStatus(game)}
            dayActions={dayActions}
            nightSummary={{ deaths, round: state.round - 1 || state.round }}
            nominationsBlocked={hasVirginExecutionToday(game)}
            onNominate={handleOpenNomination}
            onDayAction={handleOpenDayAction}
            onEndDay={handleEndDay}
            onMainMenu={onMainMenu}
            onShowRoleCard={handleShowRoleCard}
            onEditEffects={handleOpenEditEffects}
            onOpenGrimoirePlayer={(player) => {
              setGrimoireIntent({ view: 'player_detail', player })
              setShowGrimoire(true)
            }}
          />
        )
      }

      case 'day_action': {
        const ActionComponent = screen.action.ActionComponent
        return (
          <ActionComponent
            state={state}
            playerId={screen.action.playerId}
            onComplete={handleDayActionComplete}
            onBack={handleBackFromDayAction}
          />
        )
      }

      case 'pipeline_input': {
        if (!pipelineUI) return null
        const PipelineComponent = pipelineUI.Component
        return (
          <PipelineComponent
            state={pipelineUI.state}
            intent={pipelineUI.intent}
            onComplete={pipelineUI.onResult}
          />
        )
      }

      case 'grimoire_role_card': {
        const player = getPlayer(state, screen.playerId)
        if (!player) return null
        const cardRole = getRole(player.roleId)
        const cardTeamId = cardRole?.team ?? 'townsfolk'
        const cardTeam = getTeam(cardTeamId)
        return (
          <TeamBackground teamId={cardTeamId}>
            <RoleCard roleId={player.roleId} />
            <CardLink onClick={handleRoleCardClose} isEvil={cardTeam.isEvil}>
              {t.common.back}
            </CardLink>
          </TeamBackground>
        )
      }

      case 'nomination':
        return (
          <NominationScreen
            state={state}
            nominatorsToday={getNominatorsToday(game)}
            nomineesToday={getNomineesToday(game)}
            onNominate={handleNominate}
            onBack={handleBackFromNomination}
          />
        )

      case 'voting':
        return (
          <VotingPhase
            state={state}
            nomineeId={screen.nomineeId}
            blockStatus={getBlockStatus(game)}
            voteBenchmark={getVoteBenchmark(game)}
            onVoteComplete={handleVoteComplete}
            onCancel={handleCancelVote}
          />
        )

      case 'game_over':
        return (
          <GameOver
            state={state}
            onMainMenu={onMainMenu}
            onShowHistory={() => setShowHistory(true)}
          />
        )

      default:
        return null
    }
  }

  // Floating buttons are shown everywhere except:
  // - game_over: dedicated summary screen
  // - grimoire_role_card: full-screen role card overlay
  // - when a child component signals it's player-facing (via PlayerFacingScreen)
  const showFloatingButtons =
    screen.type !== 'showing_role' &&
    screen.type !== 'game_over' &&
    screen.type !== 'grimoire_role_card' &&
    screen.type !== 'pipeline_input' &&
    !isPlayerFacing

  return (
    <div className='relative'>
      <PlayerFacingContext.Provider value={playerFacingCtx}>
        {renderScreen()}
      </PlayerFacingContext.Provider>

      {/* Floating Language Toggle */}
      <div className='fixed top-4 right-4 z-50'>
        <LanguagePicker variant='floating' />
      </div>

      {/* Floating Action Buttons */}
      {showFloatingButtons && (
        <div className='fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 flex flex-col gap-2'>
          <button
            onClick={() => {
              setGrimoireIntent({ view: 'list' })
              setShowGrimoire(true)
            }}
            className='w-12 h-12 rounded-full bg-grimoire-dark/90 border border-mystic-gold/30 text-mystic-gold flex items-center justify-center shadow-lg hover:bg-grimoire-dark hover:border-mystic-gold/50 transition-colors'
            title={t.game.grimoire}
          >
            <Icon name='bookUser' size='md' />
          </button>

          <button
            onClick={() => setShowHistory(true)}
            className='w-12 h-12 rounded-full bg-grimoire-dark/90 border border-parchment-500/30 text-parchment-400 flex items-center justify-center shadow-lg hover:bg-grimoire-dark hover:border-parchment-400/50 hover:text-parchment-300 transition-colors'
            title={t.common.history}
          >
            <Icon name='history' size='md' />
          </button>
        </div>
      )}

      {/* Grimoire Modal — unified player list, detail, edit effects, effect config */}
      <GrimoireModal
        state={state}
        open={showGrimoire && showFloatingButtons}
        onClose={() => setShowGrimoire(false)}
        intent={grimoireIntent}
        onShowRoleCard={handleShowRoleCard}
        onAddEffect={handleAddEffect}
        onRemoveEffect={handleRemoveEffect}
        onUpdateEffect={handleUpdateEffect}
      />
    </div>
  )
}

function hasSetupActions(game: Game): boolean {
  const state = getCurrentState(game)
  // Check if any player's current role has a SetupAction that hasn't been completed yet
  const completedSetupPlayerIds = new Set(
    game.history
      .filter((e) => e.type === 'setup_action')
      .map((e) => e.data.playerId as string),
  )

  return state.players.some((p) => {
    if (completedSetupPlayerIds.has(p.id)) return false
    const role = getRole(p.roleId)
    return role?.SetupAction != null
  })
}

function getInitialScreen(game: Game): Screen {
  const state = getCurrentState(game)

  // Check win conditions
  if (state.phase === 'ended') {
    return { type: 'game_over' }
  }

  if (state.phase !== 'setup') {
    const winner = checkWinCondition(state, game)
    if (winner) {
      return { type: 'game_over' }
    }
  }

  switch (state.phase) {
    case 'setup':
      // Check if there are pending setup actions (e.g., Drunk choosing believed role)
      if (hasSetupActions(game)) {
        return { type: 'setup_actions' }
      }
      return { type: 'role_revelation' }
    case 'night':
      return { type: 'night_dashboard' }
    case 'day':
      return { type: 'day' }
    default:
      return { type: 'day' }
  }
}
