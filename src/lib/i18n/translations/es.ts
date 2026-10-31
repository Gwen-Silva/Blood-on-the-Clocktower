import { backupEs } from '../backup'
import { refinementEs } from '../refinement'
import { libraryEs } from '../library'
import { Translations } from '../types'
import { nightGuidanceEs } from '../nightGuidance'
import { clarityEs } from '../clarity'
import { aboutEs } from '../about'

const es: Translations = {
  backup: backupEs,
  refinement: refinementEs,
  library: libraryEs,
  about: aboutEs,
  clarity: clarityEs,
  nightGuide: nightGuidanceEs,
  storageRecovery: {
    title: 'Hay un problema con la partida',
    read: 'No se pudieron leer las partidas. Comprueba que el navegador permita guardar datos y vuelve a cargar. No borres los datos del sitio.',
    invalid:
      'Los datos están dañados o usan un formato no compatible. No se han reemplazado. Descarga una copia de recuperación antes de intentar repararlos.',
    write:
      'No se pudo guardar el último cambio. La partida está en pausa. Libera espacio si hace falta e intenta guardar de nuevo. No cierres la aplicación antes de guardar o descargar una copia.',
    unexpected:
      'La aplicación no pudo continuar. Vuelve a cargar el último estado guardado. No borres los datos del sitio.',
    backupHint:
      'La copia contiene información privada de la partida, incluidas las identidades. Guárdala para recuperar los datos; no la muestres a los jugadores.',
    download: 'Descargar copia de recuperación',
    retry: 'Reintentar guardado y recargar',
    reload: 'Recargar partida guardada',
    retryFailed:
      'Sigue sin poder guardarse. Descarga la copia antes de cerrar la aplicación.',
  },
  playerReference: {
    previousCharacter: 'Personaje anterior',
    nextCharacter: 'Siguiente personaje',
    title: 'Referencia para jugadores',
    introduction: 'Todos los personajes del guion, no los que están en juego.',
    unavailable:
      'El catálogo público de personajes no está disponible para este guion.',
    returnToStoryteller: 'Volver al Cuentacuentos',
  },
  common: {
    continue: 'Continuar',
    confirm: 'Confirmar',
    cancel: 'Cancelar',
    back: 'Volver',
    next: 'Siguiente',
    players: 'Jugadores',
    player: 'Jugador',
    roles: 'Roles',
    role: 'Rol',
    random: 'Aleatorio',
    startGame: 'Iniciar Partida',
    mainMenu: 'Menú Principal',
    history: 'Historial',
    winCondition: 'Condición de Victoria',
    youAreThe: 'Eres el/la...',
    iUnderstandMyRole: 'Entiendo mi rol',
  },

  mainMenu: {
    title: 'Grimorium',
    subtitle: 'Todo Cuentacuentos necesita un Grimorio',
    tapToOpen: 'Toca para abrir',
    continueGame: 'Continuar Partida',
    newGame: 'Nueva Partida',
    startFreshGame: 'Comenzar una nueva partida',
    rolesLibrary: 'Biblioteca de Roles',
    browseAllRoles: 'Explorar todas las cartas de rol',
    previousGames: 'Partidas Anteriores',
    completed: 'Completada',
    settingUp: 'Configurando',
    round: 'Ronda',
    language: 'Idioma',
  },

  setupReview: {
    reviewSetup: 'Revisar configuración',
    composition: 'Composición de la partida',
    playerCount: '{count} jugadores',
    clockwise: 'Asientos en sentido horario, empezando por el asiento 1',
    characters: 'Personajes por equipo',
    selectedCount: '{count} personajes seleccionados para {players} jugadores.',
    largerPool:
      'Conjunto de personajes: {count} opciones para {players} jugadores. Solo se asignarán algunos.',
    assignments: 'Plan de asignación',
    allRandom: 'Todo al azar',
    mixed: 'Asignación mixta: manual y al azar',
    allManual: 'Todo manual',
    awaitingRandom: 'Pendiente de asignación al azar',
    notFinalized:
      'Revisa la configuración. El azar se resuelve al crear la partida.',
    editPlayers: 'Editar jugadores',
    editScript: 'Editar libreto',
    editCharacters: 'Editar personajes',
    editAssignments: 'Editar asignaciones',
    createGame: 'Crear partida',
    invalidPlan:
      'Este plan está incompleto o es incompatible. Edita la configuración antes de crear la partida.',
  },
  newGame: {
    step1Title: 'Nueva Partida',
    step1Subtitle: 'Paso 1: Añadir jugadores',
    addPlayer: 'Añadir Jugador',
    playerPlaceholder: 'Jugador',
    minPlayersWarning: 'Añade al menos 5 jugadores para continuar',
    maxPlayersWarning: 'Puedes añadir hasta 15 jugadores',
    nextSelectRoles: 'Elegir personajes',
    loadedFromLastGame: 'De la última partida',

    step2Title: 'Nueva Partida',
    step2Subtitle: 'Paso 2: Seleccionar roles en juego',
    needAtLeastRoles: 'Se necesitan al menos {count} roles',
    needAtLeastImp: 'Se necesita al menos 1 Diablo',
    needExactlyRoles: 'Elige exactamente {count} personajes',
    matchDistribution: 'Iguala las cantidades de equipo mostradas arriba',
    nextAssignRoles: 'Asignar personajes',
    suggested: 'Sugerido',

    step3Title: 'Nueva Partida',
    step3Subtitle: 'Paso 3: Asignar roles (opcional)',
    assignmentInfo: 'Asigna personajes o deja jugadores al azar.',
    resetToRandom: 'Todo al azar',
    playerAssignments: 'Asignaciones de Jugadores',
    randomPool: 'Grupo al azar',
    rolesForPlayers: '{roles} roles para {players} jugadores',
    impNotAssignedWarning: 'Asigna al Diablo o deja un jugador al azar.',
    rolesRandomlyAssigned: 'Los roles se asignarán aleatoriamente',
    customizeAssignments: 'Personalizar Asignaciones',
    tapToAssign: 'Toca un jugador para asignar un rol específico',
  },

  game: {
    confirmEndDayTitle: '¿Terminar el Día {round}?',
    confirmEndDayBlocked:
      '¿Ejecutar a {player} y terminar el Día {round}? Una ejecución puede no causar muerte. Sigue la Noche {nextRound}, salvo fin de partida.',
    confirmEndDayEmpty:
      '¿Terminar el Día {round} sin ejecución? Sigue la Noche {nextRound}, salvo fin de partida.',
    confirmEndDay: 'Confirmar fin del día',
    actionDoneReview: 'Hecho · Revisar',

    narratorGiveDevice: 'Muestra a {player} su personaje.',
    narratorWakePlayer: 'Despierta a {player} ({role}).',
    narratorRoleChanged: 'Muestra a {player} su nuevo personaje.',
    readyShowToPlayer: 'Mostrar al jugador',
    yourRoleHasChanged: '¡Tu rol ha cambiado!',

    nightComplete: 'Noche {round} Completa',
    nightActionsResolved: 'Acciones nocturnas completas. Empieza el día.',
    startDay: 'Comenzar Día',
    choosePlayerToKill: 'Elige un jugador para matar',
    selectVictim: 'Selecciona la víctima que eligió.',
    confirmKill: 'Confirmar Asesinato',

    grimoire: 'Grimorio',
    daytimeActions: 'Acciones de Día',
    accusePlayerDescription: 'Elige quién nomina y a quién',

    nominatesForExecution: '{nominator} nomina a {nominee} para ejecución',
    nominatesVerb: 'nomina a',
    forExecution: 'para ejecución',

    day: 'Día',
    discussionAndNominations: 'Discusión y nominaciones',
    newNomination: 'Nueva Nominación',
    whoIsNominating: '¿Quién está nominando?',
    whoAreTheyNominating: '¿A quién están nominando?',
    selectNominator: 'Seleccionar nominador...',
    selectNominee: 'Seleccionar nominado...',
    startNomination: 'Iniciar Nominación',

    executePlayer: 'Votar sobre {player}',
    votesNeeded: '{count} votos necesarios',
    votesCount: 'Votos',
    voteThreshold: 'de {threshold} necesarios',
    voteAction: 'Votando',
    dontVote: 'No vota',
    goesOnBlock: '{player} está a punto de morir.',
    notEnoughVotes: 'No hay suficientes votos',
    tiedNoExecution: 'Empate. Nadie está a punto de morir.',
    currentBlock: '{player} está a punto de morir ({count} votos).',
    needMoreThan: 'Se necesitan más de {count} para reemplazar',
    noOneOnBlock: 'Nadie está a punto de morir.',
    endDayExecute: 'Terminar Día: Ejecutar a {player}',
    endDayNoExecution: 'Terminar Día: Sin Ejecución',
    confirmVotes: 'Confirmar Votos',
    cancelNomination: 'Cancelar Nominación',
    nominee: 'Nominado/a',
    ghostVoteAvailable: 'Voto fantasma disponible',
    ghostVoteSpent: 'Voto fantasma usado',
    cannotVote: 'No puede votar',
    butlerCannotVote: 'No puede votar a menos que el amo vote',
    butlerDeadWarning: 'La regla del amo no aplica estando muerto',

    // Slayer
    slayerAction: 'Disparo del Verdugo',
    slayerActionDescription: 'Registra quién declara ser Verdugo y su objetivo',
    selectSlayer: 'Elegir declarante',
    selectTarget: 'Seleccionar Objetivo',
    confirmSlayerShot: 'Confirmar Disparo',
    slayerRegistrationTitle: 'Registro del Verdugo',
    slayerRegistrationDescription:
      'Este jugador puede registrarse como el Demonio. Decide cómo se registra para este disparo del Verdugo.',
    registerAsDemon: 'Registrar como Demonio',

    goodWins: '¡Gana el Bien!',
    evilWins: '¡Gana el Mal!',
    townVanquishedDemon: 'Ganó el equipo del Bien.',
    demonConqueredTown: 'Ganó el equipo del Mal.',
    finalRoles: 'Roles Finales',
    backToMainMenu: 'Volver al Menú Principal',

    gameHistory: 'Historial de Partida',

    // Shared narrator keys
    narratorSetup: 'Configuración del Cuentacuentos',
    selectTwoPlayers: 'Elige 2 candidatos',
    selectWhichRoleToShow: 'Elige el personaje mostrado',
    showToPlayer: 'Mostrar al Jugador',
    oneOfThemIsThe: 'Uno de ellos es el/la...',

    // Private reveal interstitial
    returnDeviceToNarrator: 'Volver al Cuentacuentos',
    returnDeviceDescription:
      'Solo el Cuentacuentos debe ver la siguiente pantalla.',
    returnDeviceReady: 'Mantén pulsado para volver al Cuentacuentos',
    returnDeviceHoldHint: 'Mantén un segundo. Teclado: Espacio o Intro.',
    returnDeviceComplete: 'Volviendo al Cuentacuentos…',

    // Role Revelation
    revealedShowAgain: 'Revelado · Toca para mostrar de nuevo',
    skipRevelationOne:
      '{count} jugador todavía no ha visto su personaje. ¿Empezar la Noche 1 de todos modos?',
    skipRevelationMany:
      '{count} jugadores todavía no han visto su personaje. ¿Empezar la Noche 1 de todos modos?',
    skipRevelationExplanation:
      'Al confirmar, la noche empieza sin mostrar los personajes restantes.',
    confirmSkipRevelation: 'Confirmar omisión',

    roleRevelation: 'Revelación de Roles',
    roleRevelationDescription: 'Toca cada jugador para mostrarle su rol',
    tapToReveal: 'Toca para revelar',
    revealed: 'Revelado',
    startFirstNight: 'Comenzar Noche 1',
    skipRoleRevelation: 'Omitir revelaciones',
    revealAllFirst: 'Revela todos los roles antes de continuar',

    // Night Dashboard
    night: 'Noche',
    nightDashboard: 'Acciones Nocturnas',
    nightDashboardDescription:
      'Procesa la acción nocturna de cada rol en orden',
    nextAction: 'Siguiente',
    actionDone: 'Hecho',
    actionSkipped: 'Omitido',
    actionPending: 'Pendiente',
    allActionsComplete: 'Todas las acciones nocturnas han sido procesadas',
    proceedToDay: 'Proceder al Día',
    minionStartingInfo: 'Información de Secuaz',
    minionStartingInfoDescription: 'Recuerda a tus compañeros del Mal.',
    demonStartingInfo: 'Información de Demonio',
    demonStartingInfoDescription: 'Tus Secuaces y 3 personajes fuera de juego.',
    selectDemonBluffs: 'Elige los Faroles del Demonio',
    selectDemonBluffsDescription: 'Elige 3 personajes buenos fuera de juego.',
    theseAreYourBluffs: 'Estos personajes no están en juego:',

    // Night Steps
    nightSteps: 'Pasos Nocturnos',
    stepConfigurePerceptions: 'Configurar Percepciones',
    stepShowResult: 'Mostrar Resultado',
    stepShowRole: 'Mostrar Rol',
    stepNarratorSetup: 'Configuración del Cuentacuentos',
    stepChooseVictim: 'Elegir Víctima',
    stepChoosePlayer: 'Elegir Jugador',
    stepSelectPlayer: 'Seleccionar Jugador',
    stepSelectPlayers: 'Seleccionar Jugadores',
    stepAssignRedHerring: 'Asignar Pista Falsa',
    stepSelectAndShow: 'Seleccionar y Mostrar',
    stepChooseTarget: 'Elegir Objetivo',
    stepShowMinions: 'Mostrar Secuaces',
    stepSelectBluffs: 'Seleccionar Faroles',
    stepShowBluffs: 'Mostrar Faroles',
    stepSelectNewImp: 'Elegir nuevo Diablo',
    stepChooseMaster: 'Elegir Amo',
    stepViewGrimoire: 'Ver Grimorio',
    stepShowEvilTeam: 'Tu Equipo Malvado',
    noEvilTeammates: 'No hay compañeros malvados en juego',

    // Malfunction Config
    stepConfigureMalfunction: 'Configurar Mal Funcionamiento',
    playerIsMalfunctioning:
      'Sin habilidad por embriaguez o veneno. La información puede ser verdadera o falsa.',
    chooseFalseNumber: '¿Qué número debería ver?',
    chooseFalseResult: '¿Qué resultado debería ver?',
    chooseFalseTarget: '¿A qué jugador le dirán que es el rol?',
    chooseFalseRole: '¿Qué rol debería ver?',
    keepOriginalRole: 'Mantener {role}',
    malfunctionWarning: 'Mal Funcionamiento',
    registrationResultTitle: 'Elegir Resultado de Registro',
    registrationResultDescription:
      'Este personaje puede registrarse de forma distinta para cada pareja adyacente. Elige cualquier total legal para esta lectura del Chef.',
    virginRegistrationTitle: 'Registro de la Virgen',
    virginRegistrationDescription:
      '¿Debe {player} registrarse como Aldeano para esta nominación?',
    registerAsTownsfolk: 'Registrar como Aldeano',
    registerNormally: 'Registrar como su personaje real',

    // Setup Actions
    setupActions: 'Acciones de Configuración',
    setupActionsSubtitle:
      'Completa estas elecciones antes de revelar personajes.',
    allSetupActionsComplete: 'Todas las acciones de configuración completadas',
    continueToRoleRevelation: 'Revelar personajes',

    // Perception Config
    perceptionConfigTitle: 'Configurar Percepciones',
    perceptionConfigDescription:
      'Elige cómo se registra cada personaje ante esta habilidad.',
    howShouldRegister: '¿Cómo debe registrarse {player}?',
    registerAsGood: 'Bueno',
    registerAsEvil: 'Malvado',
    actualRole: 'Real: {role}',
    keepDefault: 'Por defecto (sin cambio)',
    keepOriginalTeam: '{team} (por defecto)',

    // Dawn Screen
    dawnTitle: 'Amanecer',
    dawnNoDeaths: 'Nadie murió en la noche',
    dawnDeathAnnouncement: '{player} ha muerto',
    dawnDiedInTheNight: '{player} ha muerto en la noche',
    continueToDay: 'Continuar al Día',

    // Night Summary (on Day Phase)
    nightSummary: 'Detalles de la Ronda {round}',
    noDeathsLastNight: 'Nadie murió anoche',

    // Death Revelation
    deathRevealTitle: 'Muertes',
    deathRevealSubtitle: 'Anuncia solo los nombres.',
    deathRevealDead: 'Muerto',
    deathRevealNextDeath: 'Siguiente Muerte',
    deathRevealContinue: 'Continuar',

    // Night Dashboard review
    actionSummary: 'Resumen de Acción',
    noActionRecorded: 'Sin acción registrada',

    // Role Revelation narrator hint
    roleRevelationNarratorHint:
      'En privado: selecciona a alguien y muestra solo su revelación.',

    // Nomination tracking
    alreadyNominated: 'Ya nominó hoy',
    alreadyBeenNominated: 'Ya fue nominado/a hoy',

    // Private reveal interstitial
    handDeviceTo: 'Despierta a {player} y muéstrale la pantalla',
    tapWhenReady: 'Listo para mirar',

    // Audience indicators
    audienceNarrator: 'Cuentacuentos',
    audiencePlayerChoice: 'Despertar jugador',
    audiencePlayerReveal: 'Mostrar al jugador',
    storytellerDecision: 'Esta es tu decisión como Cuentacuentos',
    wakePlayerPrompt: 'Despierta a {player} y pídele que elija',

    // Groups
    otherPlayers: 'Otros Jugadores',
    currentPlayer: 'Jugador actual',
  },

  teams: {
    townsfolk: {
      name: 'Aldeano',
      winCondition:
        'El Bien normalmente gana si no queda ningún Demonio vivo. Las habilidades pueden cambiar el resultado.',
    },
    outsider: {
      name: 'Forastero',
      winCondition:
        'Eres del Bien. Normalmente gana si no queda ningún Demonio vivo; revisa las excepciones.',
    },
    minion: {
      name: 'Secuaz',
      winCondition:
        'El Mal normalmente gana con solo 2 jugadores vivos, incluido un Demonio. Revisa las excepciones.',
    },
    demon: {
      name: 'Demonio',
      winCondition:
        'El Mal normalmente gana con solo 2 jugadores vivos, incluido un Demonio. Revisa las excepciones.',
    },
  },

  ui: {
    effects: 'Efectos',
    seeRoleCard: 'Ver Carta de Rol',
    editEffects: 'Editar Efectos',
    editEffectConfig: 'Editar Efecto',
    currentEffects: 'Efectos Actuales',
    addEffect: 'Añadir Efecto',
    noEffects: 'Sin efectos',
    close: 'Cerrar',
    narrator: 'Cuentacuentos',
    unknown: 'Desconocido',
    unknownPlayer: '[Jugador Desconocido]',
    unknownRole: '[Rol Desconocido]',
    unknownRoleId: 'Rol desconocido: {roleId}',
  },

  history: {
    noEventsYet: 'Aún no hay eventos',
    gameStarted: 'Partida iniciada',
    nightBegins: 'Noche {round} comienza',
    sunRises: 'El sol sale...',
    diedInNight: '{player} ha muerto en la noche',
    dayBegins: 'Día {round} comienza',
    learnedRole: '{player} descubrió que es el/la {role}',
    noActionTonight: '{role} no tiene acción esta noche',
    nominates: '{nominator} nomina a {nominee}',
    voteResult: '{player}: {votes} votos ({threshold} necesarios). ',
    votePassed: '{player} está a punto de morir.',
    voteFailed: 'No hay suficientes votos.',
    voteTied: 'Empate con {player}. Nadie está a punto de morir.',
    executed: '{player}: ejecución realizada.',
    goodWins: 'Gana el Bien.',
    evilWins: 'Gana el Mal.',
    effectAdded: 'El Cuentacuentos añadió {effect} a {player}',
    effectUpdated: 'El Cuentacuentos actualizó {effect} en {player}',
    effectRemoved: 'El Cuentacuentos eliminó {effect} de {player}',
    roleChanged: '{player} se convirtió en el/la {role}',
    setupAction: 'Configuración: {player} configurado como {role}',
    evilStartingInfoShown:
      '{player} recibió su información inicial del equipo malvado',
  },

  scripts: {
    'trouble-brewing': 'Problemas en el Pueblo',
    custom: 'Partida Personalizada',
    selectScript: 'Elige un Guión',
    selectScriptSubtitle:
      'Elige los personajes disponibles y las reglas de preparación.',
    enforceDistribution: 'Distribución estándar de roles',
    freeformSelection: 'Cualquier rol, cualquier distribución',
    // Generator presets
    generateRoles: 'Generar Roles',
    simple: 'Simple',
    simpleDescription: 'Roles sencillos, fáciles de aprender',
    interesting: 'Interesante',
    interestingDescription: 'Una mezcla de habilidades sencillas y complejas',
    chaotic: 'Caótico',
    chaoticDescription: 'Máximo engaño y sorpresas',
    chaos: 'Caos',
    selectThisPool: 'Seleccionar',
    regenerate: 'Regenerar',
    orPickManually: 'o elige manualmente',
    generate: 'Generar',
    manual: 'Manual',
    useThisPool: 'Usar grupo',
    presetApplied: '{preset} aplicado',
    rolesSelected: '{count} roles seleccionados',
  },

  howToPlay: {
    title: 'Cómo Jugar',
    part1Title: '1. ¿Qué es Blood on the Clocktower?',
    p1_nutshellTitle: 'El Juego en Resumen',
    p1_nutshell1:
      'Blood on the Clocktower es un juego de **deducción social**. Esta aplicación admite 5–15 jugadores, más el Cuentacuentos.',
    p1_nutshell2:
      'Un jugador es el **Cuentacuentos** (narrador): todos los demás son un **Aldeano, Forastero, Secuaz o Demonio**.',
    p1_nutshell3:
      'El **equipo del Bien** (Aldeanos + Forasteros) intenta encontrar y ejecutar al **Demonio**.',
    p1_nutshell4:
      'El **equipo del Mal** (Demonio + Secuaces) intenta matar a suficientes jugadores para ganar.',
    p1_nutshell5:
      'El juego alterna entre la **Noche** (las habilidades ocurren en secreto) y el **Día** (los jugadores discuten y votan).',
    p1_teamsTitle: 'Equipos y Alineaciones',
    p1_teamTownsfolk:
      'Estás en el **equipo del Bien**. No sabes quiénes son los demás, pero tienes una habilidad útil. Habla con la gente, comparte y combina tu información, y confía en tus instintos para encontrar al Demonio.',
    p1_teamTownsfolkExample: 'Por ejemplo, la **Lavandera** es un Aldeano:',
    p1_teamOutsider:
      'Eres del **Bien**, pero tu habilidad puede perjudicar a tu equipo. Ayuda a encontrar al Demonio.',
    p1_teamOutsiderExample: 'Por ejemplo, el **Borracho** es un Forastero:',
    p1_teamMinion:
      'Estás en el **equipo del Mal**. Protege al Demonio y confunde al pueblo. Con 7 o más jugadores, al empezar conoces al Demonio y a los otros Secuaces.',
    p1_teamMinionExample: 'Por ejemplo, el **Envenenador** es un Secuaz:',
    p1_teamDemon:
      'Estás en el **equipo del Mal**. Usa tu habilidad para matar e intenta sobrevivir. Con 7 o más jugadores, conoces a tus Secuaces y tres personajes que no están en juego y que puedes fingir ser.',
    p1_teamDemonExample: 'Por ejemplo, el **Diablo** es un Demonio:',
    p1_roundTitle: 'Cómo Funciona una Ronda',
    p1_roundNight:
      'Los jugadores cierran los ojos. El Cuentacuentos despierta a los personajes en orden para elegir o recibir información. El Diablo no mata la primera noche.',
    p1_roundDay:
      'El Cuentacuentos anuncia quién murió durante la noche. Los jugadores discuten, acusan e intentan averiguar quién es malvado.',
    p1_roundNominate:
      'Cada jugador vivo puede nominar una vez al día; cada jugador puede recibir una nominación al día. Los votos deciden quién está a punto de morir. La ejecución ocurre al terminar el día.',
    p1_roundWinGood:
      'El Bien normalmente gana cuando **no queda ningún Demonio vivo**. Resuelve primero las habilidades que puedan cambiar el resultado.',
    p1_roundWinEvil:
      'El Mal normalmente gana cuando **quedan 2 jugadores vivos**, incluido un Demonio. Algunas habilidades cambian las condiciones de victoria.',
    p1_roundWinConditions: 'Condiciones de Victoria',
    p1_roundNightLabel: 'Noche',
    p1_roundDayLabel: 'Día',
    p1_roundNominateLabel: 'Nominaciones',
    p1_conceptsTitle: 'Conceptos Clave',
    p1_conceptPoison:
      '**Envenenamiento:** El jugador no tiene habilidad mientras está envenenado. Finge que funciona; la información puede ser verdadera o falsa. No le digas que está envenenado.',
    p1_conceptDrunk:
      '**Ebriedad:** Impide que funcione una habilidad, igual que el veneno. Su duración depende de la causa. El personaje Borracho cree que es un Aldeano, pero no tiene su habilidad.',
    p1_conceptDead:
      '**Jugadores muertos:** Siguen hablando y jugando para su equipo. No pueden nominar y les queda **un voto** para el resto de la partida.',
    p1_conceptStoryteller:
      '**Cuentacuentos:** Dirige la partida, responde preguntas en privado y lleva el registro de los personajes. Usa la aplicación para anotar lo que ocurre.',

    part2Title: '2. Cómo Usar Grimorium',
    p2_createTitle: 'Crear una Partida',
    p2_create1:
      '**Añadir Jugadores**: Introduce los nombres (el Cuentacuentos no es un jugador).',
    p2_create2:
      '**Elegir un guion:** Problemas en el Pueblo aplica las restricciones habituales. La partida personalizada permite elegir libremente entre los personajes implementados.',
    p2_create3:
      '**Seleccionar personajes:** Elígelos o revisa un grupo sugerido. El generador comprueba la composición, pero no garantiza el equilibrio de la partida.',
    p2_create4:
      '**Asignar personajes:** Elige las asignaciones o deja jugadores en aleatorio.',
    p2_createTip:
      'En Problemas en el Pueblo, respeta las cantidades mostradas. Las partidas personalizadas no exigen esa distribución.',
    p2_setupTitle: 'Acciones de Configuración',
    p2_setup1:
      'Algunos roles requieren que el Cuentacuentos tome una decisión **antes** de que comience el juego.',
    p2_setup2:
      'Por ejemplo, elegir qué rol de Aldeano cree que es el Borracho. La aplicación te guía a través de la configuración.',
    p2_revealTitle: 'Revelación de Rol',
    p2_reveal1: 'Muestra a cada jugador su **carta de personaje** en privado.',
    p2_reveal2:
      'Cada carta muestra: el nombre del rol, la descripción de la habilidad, la alineación y la condición de victoria.',
    p2_reveal3:
      'Muestra cada revelación privada y mantén un segundo para devolver el dispositivo.',
    p2_revealWarning:
      'Mantén el control del dispositivo. Oculta la información privada antes de volver a las pantallas del Cuentacuentos.',
    p2_nightTitle: 'Fase de Noche',
    p2_night1:
      'El **Panel Nocturno** muestra cada rol que necesita actuar, en el orden correcto.',
    p2_night2: 'Abre la acción Siguiente y sigue sus pasos.',
    p2_night3:
      'Para **personajes de información**, revisa el resultado y toma las decisiones solicitadas antes de mostrarlo.',
    p2_night4:
      'Para **personajes que eligen un objetivo**, registra al jugador que señalan.',
    p2_night5:
      'La aplicación aplica los efectos implementados y su duración. Revisa el Grimorio si el resultado es inesperado.',
    p2_nightTip:
      'Si un jugador está **borracho o envenenado**, elige información que su personaje podría recibir normalmente. Puede ser verdadera o falsa.',
    p2_dayTitle: 'Fase de Día y Amanecer',
    p2_day1: '**Amanecer:** La aplicación anuncia las muertes de la noche.',
    p2_day2: '**Fase de Día:** Los jugadores discuten.',
    p2_day3:
      'Puedes abrir el **Grimorio** para obtener un resumen del estado de los jugadores.',
    p2_day4:
      'Puedes activar las **Acciones de Día** (ej. disparo del Cazador de Demonios) o iniciar **Nominaciones**.',
    p2_voteTitle: 'Nominaciones y Votaciones',
    p2_vote1:
      'Selecciona un nominador vivo y un nominado. Cada jugador puede nominar una vez mientras esté vivo y ser nominado una vez al día.',
    p2_vote2:
      'Marca a cada jugador cuyo voto se contó. Se vota o no se vota; no hay votos en contra.',
    p2_vote3:
      'Al menos la mitad de los vivos (redondeada hacia arriba) y más votos que cualquier nominado anterior dejan a alguien a punto de morir. Un empate válido anula ese estado; después hay que superar esa cifra.',
    p2_vote4:
      'Continúa las nominaciones si hace falta. La ejecución habitual ocurre al terminar el día. La Virgen puede causar una ejecución inmediata y terminar el día.',
    p2_endTitle: 'Fin del Día y Detección de Victoria',
    p2_end1:
      'Revisa quién está a punto de morir antes de terminar el día. La ejecución no siempre causa muerte.',
    p2_end2: 'La aplicación revisa constantemente las condiciones de victoria.',
    p2_end3:
      '**El Bien normalmente gana** cuando no queda ningún Demonio vivo después de resolver las habilidades.',
    p2_end4:
      '**El Mal normalmente gana** con dos jugadores vivos, incluido un Demonio. Revisa también las condiciones de los personajes.',
    p2_end5:
      'Cuando detecta victoria, la partida termina en la pantalla de Fin del Juego.',
    p2_grimTitle: 'El Grimorio',
    p2_grim1:
      'Usa el Grimorio para detalles privados del Cuentacuentos. El Espía tiene una vista aparte de solo lectura.',
    p2_grim2:
      'Consulta el **rol verdadero** de cada jugador, estado vivo/muerto, y los efectos activos.',
    p2_grim3:
      '**Añade o retira efectos manualmente** en casos peculiares que la app no pueda predecir.',
    p2_historyTitle: 'Registro de Historial',
    p2_history1:
      'El historial muestra las acciones registradas y sus resultados.',
    p2_history2:
      'Incluye acciones nocturnas, muertes, votos, ejecuciones, y cambio de efectos.',
    p2_history3:
      'Úsalo para revisar lo introducido. No muestra sucesos que no registraste ni permite deshacer acciones.',

    part3Title: '3. Consejos para Jugadores',
    p3_tip1Title: 'Guarda tus secretos',
    p3_tip1Desc:
      'Si eres bueno, ten cuidado en quién confías con tu información. Si eres malvado, ¡miente sobre quién eres y qué haces!',
    p3_tip2Title: 'Habla en privado',
    p3_tip2Desc:
      'Habla en privado para comparar información sin contársela a todos.',
    p3_tip3Title: '¡Finge!',
    p3_tip3Desc:
      'Puedes fingir ser otro personaje aunque seas bueno. Decide qué compartir según tu personaje y lo que sabe el grupo.',
    p3_tip4Title: 'La muerte no es el final',
    p3_tip4Desc:
      'En Blood on the clocktower, ¡los jugadores muertos siguen jugando! Te puedes comunicar con vivos durante el día y tienes **un voto final** para usarlo cuando realmente importe.',

    part4Title: '4. Consejos para el Cuentacuentos',
    p4_firstTitle: 'Para la primera vez como Cuentacuentos',
    p4_first1:
      'Comienza jugando **Problemas en el Pueblo**: está diseñado para aprender.',
    p4_first2:
      'Para empezar, considera 7–9 jugadores. Con 5 o 6 no se da la información inicial habitual del equipo del Mal.',
    p4_first3:
      'Revisa los grupos sugeridos antes de usarlos. Elige habilidades que puedas explicar al grupo.',
    p4_first4:
      'Lee las habilidades en juego y ten las reglas oficiales disponibles. La aplicación no sustituye aprender a dirigir la partida.',
    p4_duringTitle: 'Durante el Juego',
    p4_during1:
      '**Noche:** Sigue el panel y comprueba que cada jugador recibió la información prevista antes de continuar.',
    p4_during2:
      '**Día:** Deja que los jugadores hablen e interactúen. Tu deber como Cuentacuentos es dirigir, pero no intervenir en discusiones ajenas.',
    p4_during3:
      '**Grimorio:** Consulta los personajes y efectos activos en privado.',
    p4_during4:
      '**Historial:** Revisa las acciones en privado para aclarar una discrepancia. No reveles información oculta para resolver una discusión pública.',
    p4_pitfallsTitle: 'Errores Comunes',
    p4_pitfalls1:
      'Muestra al jugador solo la información privada prevista. Mantén el Grimorio y el historial fuera de su vista.',
    p4_pitfalls2:
      'Recuerda a los muertos que les queda un voto. Confirma de quién son los votos que registras.',
    p4_pitfalls3:
      'La información para un jugador borracho o envenenado puede ser verdadera o falsa. Elige un resultado que encaje con la habilidad que cree tener.',
    p4_pitfalls4:
      'Omite una acción nocturna solo cuando lo indiquen las reglas. Si la aplicación se cierra durante una acción sin resolver, repítela desde el panel.',
  },
}

export default es
