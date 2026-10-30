import { libraryEn } from '../library'
import { Translations } from '../types'
import { nightGuidanceEn } from '../nightGuidance'
import { clarityEn } from '../clarity'
import { aboutEn } from '../about'

const en: Translations = {
  library: libraryEn,
  about: aboutEn,
  clarity: clarityEn,
  nightGuide: nightGuidanceEn,
  storageRecovery: {
    title: 'Your game needs attention',
    read: 'The app could not read saved games. Check that this browser allows site storage, then reload. Do not clear site data.',
    invalid:
      'The saved data is damaged or uses an unsupported format. It has not been replaced. Download a recovery copy before attempting a repair.',
    write:
      'The latest change could not be saved. The game has paused. Free device storage if needed, then retry saving. Do not close the app before saving or downloading a recovery copy.',
    unexpected:
      'The app could not continue. Reload to return to the last saved state. Avoid clearing site data.',
    backupHint:
      'This recovery file contains private game information, including character identities. Keep it for recovery; do not show it to players.',
    download: 'Download recovery copy',
    retry: 'Retry saving and reload',
    reload: 'Reload saved game',
    retryFailed:
      'Saving still failed. Download the recovery copy before closing the app.',
  },
  playerReference: {
    previousCharacter: 'Previous character',
    nextCharacter: 'Next character',
    title: 'Player Reference',
    introduction: 'All characters in this script, not the characters in play.',
    unavailable: 'The public character catalog is unavailable for this script.',
    returnToStoryteller: 'Return to Storyteller',
  },
  common: {
    continue: 'Continue',
    confirm: 'Confirm',
    cancel: 'Cancel',
    back: 'Back',
    next: 'Next',
    players: 'Players',
    player: 'Player',
    roles: 'Roles',
    role: 'Role',
    random: 'Random',
    startGame: 'Start Game',
    mainMenu: 'Main Menu',
    history: 'History',
    winCondition: 'Win Condition',
    youAreThe: 'You are the...',
    iUnderstandMyRole: 'I understand my role',
  },

  mainMenu: {
    title: 'Grimorium',
    subtitle: 'A companion for your game.',
    tapToOpen: 'Tap to open',
    continueGame: 'Continue Game',
    newGame: 'New Game',
    startFreshGame: 'Start a fresh game',
    rolesLibrary: 'Roles Library',
    browseAllRoles: 'Browse all role cards',
    previousGames: 'Previous Games',
    completed: 'Completed',
    settingUp: 'Setting up',
    round: 'Round',
    language: 'Language',
  },

  setupReview: {
    reviewSetup: 'Review Setup',
    composition: 'Game composition',
    playerCount: '{count} players',
    clockwise: 'Clockwise seating, starting at seat 1',
    characters: 'Characters by team',
    selectedCount: '{count} selected characters for {players} players.',
    largerPool:
      'Character pool: {count} options for {players} players. Only some will be assigned.',
    assignments: 'Assignment plan',
    allRandom: 'All random',
    mixed: 'Mixed manual and random',
    allManual: 'All manual',
    awaitingRandom: 'Awaiting random assignment',
    notFinalized: 'Check the setup. Random assignments happen on Create Game.',
    editPlayers: 'Edit Players',
    editScript: 'Edit Script',
    editCharacters: 'Edit Characters',
    editAssignments: 'Edit Assignments',
    createGame: 'Create Game',
    invalidPlan:
      'This plan is incomplete or incompatible. Edit the setup before creating the game.',
  },
  newGame: {
    step1Title: 'New Game',
    step1Subtitle: 'Step 1: Add players',
    addPlayer: 'Add Player',
    playerPlaceholder: 'Player',
    minPlayersWarning: 'Add at least 5 players to continue',
    maxPlayersWarning: 'You can add up to 15 players',
    nextSelectRoles: 'Select Characters',
    loadedFromLastGame: 'From last game',

    step2Title: 'New Game',
    step2Subtitle: 'Step 2: Select roles in play',
    needAtLeastRoles: 'Need at least {count} roles',
    needAtLeastImp: 'Need at least 1 Imp',
    needExactlyRoles: 'Choose exactly {count} characters',
    matchDistribution: 'Match the team counts shown above',
    nextAssignRoles: 'Assign Characters',
    suggested: 'Suggested',

    step3Title: 'New Game',
    step3Subtitle: 'Step 3: Assign roles (optional)',
    assignmentInfo: 'Assign characters or leave players random.',
    resetToRandom: 'All random',
    playerAssignments: 'Player Assignments',
    randomPool: 'Random pool',
    rolesForPlayers: '{roles} roles for {players} players',
    impNotAssignedWarning: 'Assign the Imp, or leave a player random.',
    rolesRandomlyAssigned: 'Roles will be randomly assigned to players',
    customizeAssignments: 'Customize Assignments',
    tapToAssign: 'Tap a player to assign a specific role',
  },

  game: {
    confirmEndDayTitle: 'End Day {round}?',
    confirmEndDayBlocked:
      'Execute {player} and end Day {round}? Execution may not cause death. Night {nextRound} follows unless the game ends.',
    confirmEndDayEmpty:
      'End Day {round} without execution? Night {nextRound} follows unless the game ends.',
    confirmEndDay: 'Confirm End Day',
    actionDoneReview: 'Done · Review',

    narratorGiveDevice: 'Show {player} their character.',
    narratorWakePlayer: 'Wake {player} ({role}).',
    narratorRoleChanged: 'Show {player} their new character.',
    readyShowToPlayer: 'Show to Player',
    yourRoleHasChanged: 'Your role has changed!',

    nightComplete: 'Night {round} Complete',
    nightActionsResolved: 'Night actions complete. Start the day.',
    startDay: 'Start Day',
    choosePlayerToKill: 'Choose a player to kill',
    selectVictim: 'Select the victim they chose.',
    confirmKill: 'Confirm Kill',

    grimoire: 'Grimoire',
    daytimeActions: 'Daytime Actions',
    accusePlayerDescription: 'Choose a nominator and nominee',

    nominatesForExecution: '{nominator} nominates {nominee} for execution',
    nominatesVerb: 'nominates',
    forExecution: 'for execution',

    day: 'Day',
    discussionAndNominations: 'Discussion and nominations',
    newNomination: 'New Nomination',
    whoIsNominating: 'Who is nominating?',
    whoAreTheyNominating: 'Who are they nominating?',
    selectNominator: 'Select nominator...',
    selectNominee: 'Select nominee...',
    startNomination: 'Start Nomination',

    executePlayer: 'Vote on {player}',
    votesNeeded: '{count} votes needed',
    votesCount: 'Votes',
    voteThreshold: 'of {threshold} needed',
    voteAction: 'Voting',
    dontVote: 'Not voting',
    goesOnBlock: '{player} is about to die.',
    notEnoughVotes: 'Not enough votes',
    tiedNoExecution: 'Tie. No one is about to die.',
    currentBlock: '{player} is about to die ({count} votes).',
    needMoreThan: 'Need more than {count} to replace',
    noOneOnBlock: 'No one is about to die.',
    endDayExecute: 'End Day: Execute {player}',
    endDayNoExecution: 'End Day: No Execution',
    confirmVotes: 'Confirm Votes',
    cancelNomination: 'Cancel Nomination',
    nominee: 'Nominee',
    ghostVoteAvailable: 'Ghost vote available',
    ghostVoteSpent: 'Ghost vote used',
    cannotVote: 'Cannot vote',
    butlerCannotVote: 'Cannot vote unless master votes',
    butlerDeadWarning: 'Master rule does not apply while dead',

    // Slayer
    slayerAction: 'Slayer Shot',
    slayerActionDescription: 'Record a public Slayer claim and target',
    selectSlayer: 'Choose Claimant',
    selectTarget: 'Select Target',
    confirmSlayerShot: 'Confirm Shot',
    slayerRegistrationTitle: 'Slayer Registration',
    slayerRegistrationDescription:
      'This player may register as the Demon. Decide how they register for this Slayer shot.',
    registerAsDemon: 'Register as Demon',

    goodWins: 'Good Wins!',
    evilWins: 'Evil Wins!',
    townVanquishedDemon: 'The good team won.',
    demonConqueredTown: 'The evil team won.',
    finalRoles: 'Final Roles',
    backToMainMenu: 'Back to Main Menu',

    gameHistory: 'Game History',

    // Shared narrator keys
    narratorSetup: 'Storyteller Setup',
    selectTwoPlayers: 'Choose 2 candidates',
    selectWhichRoleToShow: 'Choose the character shown',
    showToPlayer: 'Show to Player',
    oneOfThemIsThe: 'One of them is the...',

    // Private reveal interstitial
    returnDeviceToNarrator: 'Return to Storyteller',
    returnDeviceDescription: 'Only the Storyteller should see the next screen.',
    returnDeviceReady: 'Hold to return to Storyteller',
    returnDeviceHoldHint: 'Hold for one second. Keyboard: hold Space or Enter.',
    returnDeviceComplete: 'Returning to Storyteller…',

    // Role Revelation
    revealedShowAgain: 'Revealed · Tap to show again',
    skipRevelationOne:
      "{count} player hasn't seen their role yet. Start Night 1 anyway?",
    skipRevelationMany:
      "{count} players haven't seen their roles yet. Start Night 1 anyway?",
    skipRevelationExplanation:
      'Confirming starts the night without showing the remaining roles.',
    confirmSkipRevelation: 'Confirm Skip',

    roleRevelation: 'Role Revelation',
    roleRevelationDescription: 'Tap each player to show them their role',
    tapToReveal: 'Tap to reveal',
    revealed: 'Revealed',
    startFirstNight: 'Start Night 1',
    skipRoleRevelation: 'Skip Reveals',
    revealAllFirst: 'Reveal all roles before continuing',

    // Night Dashboard
    night: 'Night',
    nightDashboard: 'Night Actions',
    nightDashboardDescription: "Process each role's night action in order",
    nextAction: 'Next',
    actionDone: 'Done',
    actionSkipped: 'Skipped',
    actionPending: 'Pending',
    allActionsComplete: 'All night actions have been processed',
    proceedToDay: 'Proceed to Day',
    minionStartingInfo: 'Minion Information',
    minionStartingInfoDescription: 'Remember your evil teammates.',
    demonStartingInfo: 'Demon Information',
    demonStartingInfoDescription: 'Your Minions and 3 characters not in play.',
    selectDemonBluffs: 'Choose the Demon Bluffs',
    selectDemonBluffsDescription: 'Choose 3 good characters not in play.',
    theseAreYourBluffs: 'These characters are not in play:',

    // Night Steps
    nightSteps: 'Night Steps',
    stepConfigurePerceptions: 'Configure Perceptions',
    stepShowResult: 'Show Result',
    stepShowRole: 'Show Role',
    stepNarratorSetup: 'Storyteller Setup',
    stepChooseVictim: 'Choose Victim',
    stepChoosePlayer: 'Choose Player',
    stepSelectPlayer: 'Select Player',
    stepSelectPlayers: 'Select Players',
    stepAssignRedHerring: 'Assign Red Herring',
    stepSelectAndShow: 'Select & Show',
    stepChooseTarget: 'Choose Target',
    stepShowMinions: 'Show Minions',
    stepSelectBluffs: 'Select Bluffs',
    stepShowBluffs: 'Show Bluffs',
    stepSelectNewImp: 'Choose New Imp',
    stepChooseMaster: 'Choose Master',
    stepViewGrimoire: 'View Grimoire',
    stepShowEvilTeam: 'Your Evil Team',
    noEvilTeammates: 'No evil teammates in play',

    // Malfunction Config
    stepConfigureMalfunction: 'Configure Malfunction',
    playerIsMalfunctioning:
      'No ability while drunk or poisoned. Information may be true or false.',
    chooseFalseNumber: 'What number should they see?',
    chooseFalseResult: 'What result should they see?',
    chooseFalseTarget: 'Which player should they be told is the role?',
    chooseFalseRole: 'What role should they see?',
    keepOriginalRole: 'Keep {role}',
    malfunctionWarning: 'Malfunctioning',
    registrationResultTitle: 'Choose Registration Result',
    registrationResultDescription:
      'This character may register differently for each adjacent pair. Choose any legal total for this Chef reading.',
    virginRegistrationTitle: 'Virgin Registration',
    virginRegistrationDescription:
      'Should {player} register as a Townsfolk for this nomination?',
    registerAsTownsfolk: 'Register as Townsfolk',
    registerNormally: 'Register as their actual character',

    // Setup Actions
    setupActions: 'Setup Actions',
    setupActionsSubtitle: 'Complete these choices before revealing characters.',
    allSetupActionsComplete: 'All setup actions complete',
    continueToRoleRevelation: 'Reveal Characters',

    // Perception Config
    perceptionConfigTitle: 'Configure Perceptions',
    perceptionConfigDescription:
      'Choose how each character registers for this ability.',
    howShouldRegister: 'How should {player} register?',
    registerAsGood: 'Good',
    registerAsEvil: 'Evil',
    actualRole: 'Actual: {role}',
    keepDefault: 'Default (no change)',
    keepOriginalTeam: '{team} (default)',

    // Dawn Screen
    dawnTitle: 'Dawn',
    dawnNoDeaths: 'No one died in the night',
    dawnDeathAnnouncement: '{player} has died',
    dawnDiedInTheNight: '{player} died in the night',
    continueToDay: 'Continue to Day',

    // Death Revelation
    deathRevealTitle: 'Deaths',
    deathRevealSubtitle: 'Announce only the names.',
    deathRevealDead: 'Dead',
    deathRevealNextDeath: 'Next Death',
    deathRevealContinue: 'Continue',

    // Night Summary (on Day Phase)
    nightSummary: 'Round {round} Details',
    noDeathsLastNight: 'No one died last night',

    // Night Dashboard review
    actionSummary: 'Action Summary',
    noActionRecorded: 'No action recorded',

    // Role Revelation narrator hint
    roleRevelationNarratorHint:
      'Private: select a player, then show only their reveal.',

    // Nomination tracking
    alreadyNominated: 'Already nominated today',
    alreadyBeenNominated: 'Already been nominated today',

    // Private reveal interstitial
    handDeviceTo: 'Wake {player} and show them the screen',
    tapWhenReady: 'Ready to Look',

    // Audience indicators
    audienceNarrator: 'Storyteller',
    audiencePlayerChoice: 'Wake player',
    audiencePlayerReveal: 'Show to player',
    storytellerDecision: 'This is your decision as Storyteller',
    wakePlayerPrompt: 'Wake {player} and ask them to choose',

    // Groups
    otherPlayers: 'Other Players',
    currentPlayer: 'Current player',
  },

  teams: {
    townsfolk: {
      name: 'Townsfolk',
      winCondition:
        'Good normally wins when no Demon is alive. Character abilities can change the result.',
    },
    outsider: {
      name: 'Outsider',
      winCondition:
        'You are good. Good normally wins when no Demon is alive; check character exceptions.',
    },
    minion: {
      name: 'Minion',
      winCondition:
        'Evil normally wins with only 2 players alive, including a Demon. Check character exceptions.',
    },
    demon: {
      name: 'Demon',
      winCondition:
        'Evil normally wins with only 2 players alive, including a Demon. Check character exceptions.',
    },
  },

  ui: {
    effects: 'Effects',
    seeRoleCard: 'See Role Card',
    editEffects: 'Edit Effects',
    editEffectConfig: 'Edit Effect',
    currentEffects: 'Current Effects',
    addEffect: 'Add Effect',
    noEffects: 'No effects',
    close: 'Close',
    narrator: 'Narrator',
    unknown: 'Unknown',
    unknownPlayer: '[Unknown Player]',
    unknownRole: '[Unknown Role]',
    unknownRoleId: 'Unknown role: {roleId}',
  },

  history: {
    noEventsYet: 'No events yet',
    gameStarted: 'Game started',
    nightBegins: 'Night {round} begins',
    sunRises: 'The sun rises...',
    diedInNight: '{player} has died in the night',
    dayBegins: 'Day {round} begins',
    learnedRole: '{player} learned they are the {role}',
    noActionTonight: '{role} has no action tonight',
    nominates: '{nominator} nominates {nominee}',
    voteResult: '{player}: {votes} votes ({threshold} needed). ',
    votePassed: '{player} is about to die.',
    voteFailed: 'Not enough votes.',
    voteTied: 'Tie with {player}. No one is about to die.',
    executed: '{player} was executed.',
    goodWins: 'Good wins.',
    evilWins: 'Evil wins.',
    effectAdded: 'Storyteller added {effect} to {player}',
    effectUpdated: 'Storyteller updated {effect} on {player}',
    effectRemoved: 'Storyteller removed {effect} from {player}',
    roleChanged: '{player} became the {role}',
    setupAction: 'Setup: {player} configured as {role}',
    evilStartingInfoShown: '{player} received their evil starting information',
  },

  scripts: {
    'trouble-brewing': 'Trouble Brewing',
    custom: 'Custom Game',
    selectScript: 'Choose a Script',
    selectScriptSubtitle: 'Choose the available characters and setup rules.',
    enforceDistribution: 'Standard role distribution',
    freeformSelection: 'Any roles, any distribution',
    // Generator presets
    generateRoles: 'Generate Roles',
    simple: 'Simple',
    simpleDescription: 'Straightforward roles, easy to learn',
    interesting: 'Interesting',
    interestingDescription: 'A mix of simpler and more complex abilities',
    chaotic: 'Chaotic',
    chaoticDescription: 'Maximum deception and surprises',
    chaos: 'Chaos',
    selectThisPool: 'Select',
    regenerate: 'Regenerate',
    orPickManually: 'or pick manually',
    generate: 'Generate',
    manual: 'Manual',
    useThisPool: 'Use Set',
    presetApplied: '{preset} applied',
    rolesSelected: '{count} roles selected',
  },

  howToPlay: {
    title: 'How To Play',
    part1Title: '1. What Is Blood on the Clocktower?',
    p1_nutshellTitle: 'The Game in a Nutshell',
    p1_nutshell1:
      'Blood on the Clocktower is a **social deduction game**. This app supports 5–15 players, plus a Storyteller.',
    p1_nutshell2:
      'One player is the **Storyteller** (narrator): everyone else is a **Townsfolk, Outsider, Minion, or Demon**.',
    p1_nutshell3:
      'The **Good team** (Townsfolk + Outsiders) tries to find and execute the **Demon**.',
    p1_nutshell4:
      'The **Evil team** (Demon + Minions) tries to kill enough players to win.',
    p1_nutshell5:
      'The game alternates between **Night** (abilities happen secretly) and **Day** (players discuss and vote).',
    p1_teamsTitle: 'Teams & Alignments',
    p1_teamTownsfolk:
      'You are on the **Good team**. You do not know who anyone else is, but you have a useful ability. Talk to people, share and combine your information, and trust your instincts to find the Demon.',
    p1_teamTownsfolkExample: 'For example, the **Washerwoman** is a Townsfolk:',
    p1_teamOutsider:
      'You are **good**, but your ability can hinder your team. Help find the Demon.',
    p1_teamOutsiderExample: 'For example, the **Drunk** is an Outsider:',
    p1_teamMinion:
      'You are on the **Evil team**. Protect the Demon and mislead the town. In games with 7 or more players, you learn who the Demon and the other Minions are at the start.',
    p1_teamMinionExample: 'For example, the **Poisoner** is a Minion:',
    p1_teamDemon:
      'You are on the **Evil team**. Use your ability to kill and try to survive. In games with 7 or more players, you learn your Minions and three out-of-play characters you can bluff as.',
    p1_teamDemonExample: 'For example, the **Imp** is a Demon:',
    p1_roundTitle: 'How a Round Works',
    p1_roundNight:
      'Players close their eyes. The Storyteller wakes characters in order to make choices or receive information. The Imp does not kill on the first night.',
    p1_roundDay:
      'The Storyteller announces who died overnight. Players discuss, accuse, and try to figure out who is evil.',
    p1_roundNominate:
      'Each living player may nominate once per day; each player may be nominated once per day. Votes decide who is about to die. Execute at day end.',
    p1_roundWinGood:
      'Good normally wins when **no Demon is alive**. Resolve abilities that can prevent or change this result first.',
    p1_roundWinEvil:
      'Evil normally wins when **only 2 players remain alive**, including a Demon. Some abilities change the win conditions.',
    p1_roundWinConditions: 'Win Conditions',
    p1_roundNightLabel: 'Night',
    p1_roundDayLabel: 'Day',
    p1_roundNominateLabel: 'Nominations',
    p1_conceptsTitle: 'Key Concepts',
    p1_conceptPoison:
      '**Poisoning:** The player has no ability while poisoned. Pretend it works; information may be true or false. Do not tell them they are poisoned.',
    p1_conceptDrunk:
      '**Drunkenness:** Like poisoning, it prevents an ability from working. Its duration depends on the source. The Drunk character believes they are a Townsfolk, but has no Townsfolk ability.',
    p1_conceptDead:
      '**Dead players:** Keep talking and playing for your team. You cannot nominate and have **one vote** left for the rest of the game.',
    p1_conceptStoryteller:
      '**Storyteller:** Run the game, answer questions in private and keep track of the characters. Use the app to record what happens.',

    part2Title: '2. How To Use Grimorium',
    p2_createTitle: 'Creating a Game',
    p2_create1:
      '**Add Players**: Enter player names (the Storyteller is not a player).',
    p2_create2:
      '**Choose a script:** Trouble Brewing uses the standard setup restrictions. Custom Game lets you select freely from the implemented characters.',
    p2_create3:
      '**Select characters:** Pick them yourself or review a suggested set. The generator checks composition, not how balanced the game will feel.',
    p2_create4:
      '**Assign characters:** Choose assignments or leave players set to random.',
    p2_createTip:
      'In Trouble Brewing, match the displayed character counts. Custom games do not enforce this distribution.',
    p2_setupTitle: 'Setup Actions',
    p2_setup1:
      'Some roles require the Storyteller to make a decision **before** the game begins.',
    p2_setup2:
      'For example, choosing which Townsfolk role the Drunk believes they are. The app guides you through each setup action automatically.',
    p2_revealTitle: 'Role Revelation',
    p2_reveal1: 'Show each player their **character card** in private.',
    p2_reveal2:
      'Each card shows: the role name, ability description, alignment, and win condition.',
    p2_reveal3:
      'Show each private reveal, then use the one-second hold to return the device.',
    p2_revealWarning:
      'Keep control of the device. Hide private information before returning to the Storyteller screens.',
    p2_nightTitle: 'Night Phase',
    p2_night1:
      'The **Night Dashboard** shows every role that needs to act, in the correct wake order.',
    p2_night2: 'Open the Next action and follow its steps.',
    p2_night3:
      'For **information characters**, check the result and make any requested Storyteller choices before showing it.',
    p2_night4:
      'For **characters choosing a target**, record the player they point to.',
    p2_night5:
      'The app applies supported effects and their expiration. Check the Grimoire if the result is unexpected.',
    p2_nightTip:
      'If a player is **drunk or poisoned**, choose information their character could normally receive. It may be true or false.',
    p2_dayTitle: 'Dawn & Day Phase',
    p2_day1: '**Dawn:** The app announces overnight deaths.',
    p2_day2: '**Day Phase:** Players discuss.',
    p2_day3:
      'You can open the **Grimoire** for a status overview of all players.',
    p2_day4:
      'You can trigger **Day Actions** (e.g., Slayer shot) or start **Nominations**.',
    p2_voteTitle: 'Nominations & Voting',
    p2_vote1:
      'Select a living nominator and a nominee. Each player may nominate once while alive and be nominated once per day.',
    p2_vote2:
      'Mark each player whose vote was counted. Players either vote or do not vote; there are no votes against.',
    p2_vote3:
      'At least half the living players (round up) and more votes than every earlier nominee makes someone about to die. A qualifying tie clears that status; later votes must beat the tied count.',
    p2_vote4:
      'Continue nominations as needed. The usual execution happens at the end of the day. The Virgin can cause an immediate execution and end the day.',
    p2_endTitle: 'End of Day & Win Detection',
    p2_end1:
      'Check who is about to die before ending the day. Execution does not always cause death.',
    p2_end2: 'The app continuously checks win conditions.',
    p2_end3:
      '**Good normally wins** when no Demon remains alive after resolving abilities.',
    p2_end4:
      '**Evil normally wins** with two living players including a Demon. Check character-specific conditions too.',
    p2_end5: 'When a win is detected, the game ends with a Game Over screen.',
    p2_grimTitle: 'The Grimoire',
    p2_grim1:
      'Use Grimoire for private Storyteller details. The Spy has a separate read-only view.',
    p2_grim2:
      "See every player's **true role**, alive/dead status, and active effects.",
    p2_grim3:
      "**Manually add/remove effects** for edge cases the app can't predict.",
    p2_historyTitle: 'History Log',
    p2_history1: 'The history shows recorded actions and their results.',
    p2_history2:
      'Includes night actions, deaths, votes, executions, and effect changes.',
    p2_history3:
      'Use it to check what was entered. It cannot show events that were never recorded, and it is not an undo tool.',

    part3Title: '3. Tips for Players',
    p3_tip1Title: 'Keep your secrets',
    p3_tip1Desc:
      'If you are good, be careful who you trust with your information. If you are evil, lie about who your character is and what they do!',
    p3_tip2Title: 'Talk to people privately',
    p3_tip2Desc:
      'Talk privately to compare information without telling everyone.',
    p3_tip3Title: 'Bluff!',
    p3_tip3Desc:
      'You may bluff even if you are good. Decide what to share based on your character and what the group knows.',
    p3_tip4Title: 'Death is not the end',
    p3_tip4Desc:
      'In Blood on the Clocktower, dead players continue to play! You still close your eyes at night, you still talk during the day, and you get **one final vote** to use when it counts most.',

    part4Title: '4. Tips for Storytellers',
    p4_firstTitle: 'For First-Time Storytellers',
    p4_first1: "Start with **Trouble Brewing**: it's designed for learning.",
    p4_first2:
      'For a first game, consider 7–9 players. Games with 5 or 6 players omit the usual evil starting information.',
    p4_first3:
      'Review suggested character sets before using them. Choose abilities you can explain to the group.',
    p4_first4:
      'Read the abilities in play and keep the official rules available for questions. The app does not replace learning to run the game.',
    p4_duringTitle: 'During the Game',
    p4_during1:
      '**Night:** Follow the dashboard and check that each player received the intended information before continuing.',
    p4_during2:
      '**Day:** Let players talk. Your job is to facilitate, not control the discussion.',
    p4_during3: '**Grimoire:** Check characters and active effects in private.',
    p4_during4:
      '**History:** Check recorded actions privately when you need to resolve a discrepancy. Do not reveal hidden information to settle a public argument.',
    p4_pitfallsTitle: 'Common Pitfalls',
    p4_pitfalls1:
      'Show only the intended private information to a player. Keep the Grimoire and history out of view.',
    p4_pitfalls2:
      'Remind dead players that they have one vote left. Confirm whose votes you record.',
    p4_pitfalls3:
      'Information given to a drunk or poisoned player may be true or false. Choose a result that fits the ability they believe they have.',
    p4_pitfalls4:
      'Skip a night action only when the rules call for it. If the app closes during an unresolved action, repeat it from the dashboard.',
  },
}

export default en
