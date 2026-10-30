import { libraryPtBR } from '../library'
import type { Translations } from '../types'
import { aboutPtBR } from '../about'

const ptBR: Translations = {
  library: libraryPtBR,
  about: aboutPtBR,
  clarity: {
    rules: 'Ver regras',
    officialWiki: 'Consultar wiki oficial',
    saintNote: 'A morte à noite não aciona essa derrota.',
    details: 'Detalhes',
    notes: 'Notas do Narrador',
    yourAbility: 'Sua habilidade',
    reference: 'Referência de personagem',
    candidates: '{first} ou {second}',
    oneIs: 'Um deles é {role}.',
    shownCharacter: 'Sobre o personagem mostrado',
    shownCharacterHint:
      'Esta descrição é do personagem mostrado na sua informação.',
    startingInformation: 'Sua informação inicial',
    spyInspect: 'Toque em alguém para consultar. Continue ao terminar.',
    spyBack: 'Voltar ao Grimório',
    spyDetails: '{player} · {role}',
    died: '{player} morreu.',
    didNotDie: '{player} não morreu.',
    gameName: 'Partida {date}',
    increase: 'Aumentar número',
    decrease: 'Diminuir número',
  },
  nightGuide: {
    title: 'O que fazer agora',
    playerTitle: 'Referência de personagem',
    example: 'Exemplo fictício',
    checks: 'Notas do Narrador',
    nextTitle: 'Próximo passo',
    next: 'Conclua a escolha ou revelação e peça ao jogador que durma.',
    dashboard:
      'Abra a ação marcada como Próxima. Conclua as etapas antes de iniciar o dia.',
    actions: 'Ferramentas da partida',
    roles: {
      washerwoman: {
        now: 'Escolha 2 jogadores e o Cidadão a mostrar.',
        player:
          'Você descobre dois jogadores e um personagem Cidadão. Um deles se registra como esse personagem; você não sabe qual.',
        note: 'Confira os registros opcionais. Com embriaguez ou veneno, a informação pode ser verdadeira ou falsa.',
      },
      librarian: {
        now: 'Escolha 2 jogadores e um Forasteiro ou confira a opção de nenhum Forasteiro.',
        player:
          'Você descobre dois jogadores e um personagem Forasteiro ou que não há Forasteiros em jogo. Não descobre qual dos dois é o Forasteiro. É uma informação inicial, não uma nova consulta a cada noite.',
        example:
          '“Alice ou Bob é o Santo.” Os nomes são fictícios; este não é o resultado da sua partida.',
        note: 'Com cinco jogadores, normalmente não há Forasteiros, mas o Barão muda a composição. O Espião pode se registrar como Forasteiro; o Recluso também pode ter outro registro. Embriaguez e veneno permitem informações verdadeiras ou falsas. Use as opções disponíveis. Se faltar uma opção de registro válida, o Narrador precisa decidir sem inventar resultados nem mudar os personagens reais.',
      },
      investigator: {
        now: 'Escolha 2 jogadores e o Lacaio a mostrar.',
        player:
          'Você descobre dois jogadores e um personagem Lacaio. Um deles se registra como esse personagem, mas você não sabe qual.',
        note: 'O registro do Recluso pode afetar o resultado. Com embriaguez ou veneno, a informação pode ser verdadeira ou falsa; use as opções disponíveis.',
      },
      chef: {
        now: 'Confira a quantidade de pares do Mal e mostre ao Cozinheiro.',
        player:
          'Seu número inicial conta pares de vizinhos do Mal, incluindo o par que fecha o círculo. Não é o total de jogadores do Mal.',
        example:
          'Três jogadores do Mal seguidos formam dois pares de vizinhos.',
        note: 'Os registros do Espião e do Recluso podem afetar a contagem. Confira as opções permitidas em vez de usar apenas os alinhamentos reais.',
      },
      empath: {
        now: 'Confira a contagem entre os vizinhos vivos e mostre ao Empata.',
        player:
          'A cada noite, você descobre quantos dos seus dois vizinhos vivos se registram como do Mal: 0, 1 ou 2. Pule os mortos ao encontrar os vizinhos vivos mais próximos.',
        note: 'Registros opcionais podem mudar a informação. Com embriaguez ou veneno, ela pode ser verdadeira ou falsa.',
      },
      fortune_teller: {
        now: 'Acorde o Adivinho e anote suas 2 escolhas.',
        player:
          'Escolha dois jogadores. Você descobre se algum se registra como Demônio. Um jogador do Bem marcado como Pista Falsa também pode gerar Sim; a resposta não revela qual dos dois gerou o resultado.',
        note: 'A Pista Falsa é definida na preparação. Registro, embriaguez e veneno podem afetar a resposta; não revele quem é a Pista Falsa.',
      },
      spy: {
        now: 'Acorde o Espião e deixe que consulte o Grimório sem editar.',
        player:
          'A cada noite, você pode consultar o Grimório mostrado pelo Narrador. Memorize as informações e devolva o aparelho.',
        note: 'O registro do Espião para outras habilidades continua sendo uma decisão do Narrador. Siga as instruções do app se a habilidade não funcionar.',
      },
      poisoner: {
        now: 'Acorde o Envenenador e anote seu alvo.',
        player:
          'Escolha um jogador por noite para envenenar. Você não descobre seu personagem nem se a habilidade foi afetada.',
        note: 'O app aplica o efeito e sua duração. Não troque personagens ou informações manualmente para representar o veneno.',
      },
      monk: {
        now: 'Acorde o Monge e anote outro jogador para proteger.',
        player:
          'A cada noite, exceto a primeira, escolha outro jogador para proteger do Demônio nesta noite.',
        note: 'O Monge não age na Noite 1. Use apenas os alvos habilitados pelo app.',
      },
      ravenkeeper: {
        now: 'Acorde o Guardião dos Corvos, anote sua escolha e prepare o personagem a mostrar.',
        player:
          'Se morrer à noite, escolha um jogador e descubra o personagem conforme ele se registra para sua habilidade.',
        note: 'Essa ação depende de uma morte à noite; não ocorre em toda primeira noite.',
      },
      undertaker: {
        now: 'Confira quem morreu por execução hoje e prepare o personagem a mostrar.',
        player:
          'A cada noite, exceto a primeira, descubra o personagem de quem morreu por execução hoje. Sem morte por execução, não há personagem a descobrir.',
        note: 'Uma execução sem morte não conta como morte por execução. Siga a lista de ações e o resultado registrado.',
      },
      butler: {
        now: 'Acorde o Mordomo e anote outro jogador como mestre.',
        player:
          'Escolha outro jogador a cada noite. Amanhã, você só pode votar enquanto essa pessoa também estiver votando. O Narrador acompanha essa restrição.',
      },
      imp: {
        now: 'Acorde o Diabrete e anote a vítima escolhida.',
        player:
          'A cada noite, exceto a primeira, escolha um jogador para matar. Se matar a si mesmo, um Lacaio pode virar o Diabrete; o Narrador resolve o resultado.',
        note: 'Não há ataque na Noite 1. A informação inicial do Mal tem uma etapa separada; siga a ordem e as regras de quantidade de jogadores do app.',
      },
    },
  },
  storageRecovery: {
    title: 'Sua partida precisa de atenção',
    read: 'Não foi possível ler as partidas salvas. Confira se o navegador permite armazenar dados deste site e recarregue. Não apague os dados do site.',
    invalid:
      'Os dados salvos estão danificados ou usam um formato incompatível. Nada foi substituído. Baixe uma cópia de recuperação antes de tentar corrigir.',
    write:
      'Não foi possível salvar a última alteração. A partida foi pausada. Libere espaço no aparelho, se necessário, e tente salvar novamente. Não feche o app antes de salvar ou baixar uma cópia de recuperação.',
    unexpected:
      'O app não pôde continuar. Recarregue para voltar ao último estado salvo. Não apague os dados do site.',
    backupHint:
      'Este arquivo contém informações privadas, incluindo os personagens dos jogadores. Guarde para recuperação; não mostre aos jogadores.',
    download: 'Baixar cópia de recuperação',
    retry: 'Tentar salvar e recarregar',
    reload: 'Recarregar partida salva',
    retryFailed:
      'Ainda não foi possível salvar. Baixe a cópia de recuperação antes de fechar o app.',
  },
  playerReference: {
    previousCharacter: 'Personagem anterior',
    nextCharacter: 'Próximo personagem',
    title: 'Referência dos jogadores',
    introduction:
      'Todos os personagens deste roteiro, não os personagens em jogo.',
    unavailable:
      'O catálogo público de personagens não está disponível para este roteiro.',
    returnToStoryteller: 'Devolver ao Narrador',
  },
  common: {
    continue: 'Continuar',
    confirm: 'Confirmar',
    cancel: 'Cancelar',
    back: 'Voltar',
    next: 'Próximo',
    players: 'Jogadores',
    player: 'Jogador',
    roles: 'Personagens',
    role: 'Personagem',
    random: 'Aleatório',
    startGame: 'Iniciar partida',
    mainMenu: 'Menu principal',
    history: 'Histórico',
    winCondition: 'Condição de vitória',
    youAreThe: 'Seu personagem é...',
    iUnderstandMyRole: 'Entendi meu personagem',
  },
  mainMenu: {
    title: 'Grimorium',
    subtitle: 'Um companheiro para sua partida.',
    tapToOpen: 'Toque para abrir',
    continueGame: 'Continuar partida',
    newGame: 'Nova partida',
    startFreshGame: 'Começar uma nova partida',
    rolesLibrary: 'Biblioteca de personagens',
    browseAllRoles: 'Consultar todos os personagens',
    previousGames: 'Partidas anteriores',
    completed: 'Concluída',
    settingUp: 'Em preparação',
    round: 'Rodada',
    language: 'Idioma',
  },
  setupReview: {
    reviewSetup: 'Revisar preparação',
    composition: 'Composição da partida',
    playerCount: '{count} jogadores',
    clockwise: 'Assentos em sentido horário, começando pelo assento 1',
    characters: 'Personagens por equipe',
    selectedCount: '{count} personagens escolhidos para {players} jogadores.',
    largerPool:
      'Conjunto: {count} opções para {players} jogadores. Apenas algumas serão atribuídas.',
    assignments: 'Plano de atribuição',
    allRandom: 'Tudo aleatório',
    mixed: 'Parte manual, parte aleatória',
    allManual: 'Tudo manual',
    awaitingRandom: 'Aguardando sorteio',
    notFinalized:
      'Confira a preparação. Os sorteios acontecem ao criar a partida.',
    editPlayers: 'Editar jogadores',
    editScript: 'Editar roteiro',
    editCharacters: 'Editar personagens',
    editAssignments: 'Editar atribuições',
    createGame: 'Criar partida',
    invalidPlan:
      'A preparação está incompleta ou incompatível. Edite antes de criar a partida.',
  },
  newGame: {
    step1Title: 'Nova partida',
    step1Subtitle: 'Etapa 1: Adicionar jogadores',
    addPlayer: 'Adicionar jogador',
    playerPlaceholder: 'Jogador',
    minPlayersWarning: 'Adicione pelo menos 5 jogadores para continuar',
    maxPlayersWarning: 'Você pode adicionar até 15 jogadores',
    nextSelectRoles: 'Escolher personagens',
    loadedFromLastGame: 'Da última partida',
    step2Title: 'Nova partida',
    step2Subtitle: 'Etapa 2: Escolher personagens em jogo',
    needAtLeastRoles: 'São necessários pelo menos {count} personagens',
    needAtLeastImp: 'É necessário pelo menos 1 Diabrete',
    needExactlyRoles: 'Escolha exatamente {count} personagens',
    matchDistribution: 'Use as quantidades por equipe mostradas acima',
    nextAssignRoles: 'Atribuir personagens',
    suggested: 'Sugerido',
    step3Title: 'Nova partida',
    step3Subtitle: 'Etapa 3: Atribuir personagens (opcional)',
    assignmentInfo:
      'Atribua personagens ou deixe jogadores com sorteio aleatório.',
    resetToRandom: 'Tudo aleatório',
    playerAssignments: 'Atribuições dos jogadores',
    randomPool: 'Conjunto para sorteio',
    rolesForPlayers: '{roles} personagens para {players} jogadores',
    impNotAssignedWarning:
      'Atribua o Diabrete ou deixe um jogador com sorteio aleatório.',
    rolesRandomlyAssigned: 'Os personagens serão sorteados entre os jogadores',
    customizeAssignments: 'Personalizar atribuições',
    tapToAssign: 'Toque em um jogador para atribuir um personagem',
  },
  game: {
    confirmEndDayTitle: 'Encerrar o Dia {round}?',
    confirmEndDayBlocked:
      'Executar {player} e encerrar o Dia {round}? A execução pode não causar morte. A Noite {nextRound} começa em seguida, se a partida não terminar.',
    confirmEndDayEmpty:
      'Encerrar o Dia {round} sem execução? A Noite {nextRound} começa em seguida, se a partida não terminar.',
    confirmEndDay: 'Confirmar fim do dia',
    actionDoneReview: 'Concluída · Rever',
    narratorGiveDevice: 'Mostre o personagem de {player} em particular.',
    narratorWakePlayer: 'Acorde {player} ({role}).',
    narratorRoleChanged: 'Mostre o novo personagem de {player}.',
    readyShowToPlayer: 'Mostrar ao jogador',
    yourRoleHasChanged: 'Seu personagem mudou!',
    nightComplete: 'Noite {round} concluída',
    nightActionsResolved: 'Ações noturnas concluídas. Inicie o dia.',
    startDay: 'Iniciar dia',
    choosePlayerToKill: 'Escolha um jogador para matar',
    selectVictim: 'Selecione a vítima escolhida.',
    confirmKill: 'Confirmar ataque',
    grimoire: 'Grimório',
    daytimeActions: 'Ações diurnas',
    accusePlayerDescription: 'Escolha quem nomeia e quem recebe a nomeação',
    nominatesForExecution: '{nominator} nomeia {nominee} para execução',
    nominatesVerb: 'nomeia',
    forExecution: 'para execução',
    day: 'Dia',
    discussionAndNominations: 'Discussão e nomeações',
    newNomination: 'Nova nomeação',
    whoIsNominating: 'Quem está nomeando?',
    whoAreTheyNominating: 'Quem recebe a nomeação?',
    selectNominator: 'Escolha quem nomeia...',
    selectNominee: 'Escolha quem recebe a nomeação...',
    startNomination: 'Iniciar nomeação',
    executePlayer: 'Votação: {player}',
    votesNeeded: 'São necessários {count} votos',
    votesCount: 'Votos',
    voteThreshold: 'de {threshold} necessários',
    voteAction: 'Votando',
    dontVote: 'Não votando',
    goesOnBlock: '{player} está prestes a morrer.',
    notEnoughVotes: 'Votos insuficientes',
    tiedNoExecution: 'Empate. Ninguém está prestes a morrer.',
    currentBlock: '{player} está prestes a morrer ({count} votos).',
    needMoreThan: 'Precisa de mais de {count} votos para assumir a liderança',
    noOneOnBlock: 'Ninguém está prestes a morrer.',
    endDayExecute: 'Encerrar dia: executar {player}',
    endDayNoExecution: 'Encerrar dia sem execução',
    confirmVotes: 'Confirmar votos',
    cancelNomination: 'Cancelar nomeação',
    nominee: 'Pessoa nomeada',
    ghostVoteAvailable: 'Voto de fantasma disponível',
    ghostVoteSpent: 'Voto de fantasma usado',
    cannotVote: 'Não pode votar',
    butlerCannotVote: 'Só pode votar enquanto o mestre vota',
    butlerDeadWarning: 'A regra do mestre não se aplica após a morte',
    slayerAction: 'Disparo do Caçador',
    slayerActionDescription:
      'Registre uma declaração pública de Caçador e seu alvo',
    selectSlayer: 'Escolher quem dispara',
    selectTarget: 'Escolher alvo',
    confirmSlayerShot: 'Confirmar disparo',
    slayerRegistrationTitle: 'Registro para o Caçador',
    slayerRegistrationDescription:
      'Este jogador pode se registrar como Demônio. Decida como ele se registra para este disparo.',
    registerAsDemon: 'Registrar como Demônio',
    goodWins: 'O Bem venceu!',
    evilWins: 'O Mal venceu!',
    townVanquishedDemon: 'A equipe do Bem venceu.',
    demonConqueredTown: 'A equipe do Mal venceu.',
    finalRoles: 'Personagens finais',
    backToMainMenu: 'Voltar ao menu principal',
    gameHistory: 'Histórico da partida',
    narratorSetup: 'Preparação do Narrador',
    selectTwoPlayers: 'Escolha 2 jogadores',
    selectWhichRoleToShow: 'Escolha o personagem mostrado',
    showToPlayer: 'Mostrar ao jogador',
    oneOfThemIsThe: 'Um deles é...',
    returnDeviceToNarrator: 'Devolver ao Narrador',
    returnDeviceDescription: 'Só o Narrador deve ver a próxima tela.',
    returnDeviceReady: 'Segure para devolver ao Narrador',
    returnDeviceHoldHint:
      'Segure por um segundo. No teclado, mantenha Espaço ou Enter pressionado.',
    returnDeviceComplete: 'Devolvendo ao Narrador…',
    revealedShowAgain: 'Revelado · Toque para mostrar novamente',
    skipRevelationOne:
      '{count} jogador ainda não viu seu personagem. Iniciar a Noite 1 mesmo assim?',
    skipRevelationMany:
      '{count} jogadores ainda não viram seus personagens. Iniciar a Noite 1 mesmo assim?',
    skipRevelationExplanation:
      'Confirmar inicia a noite sem mostrar os personagens restantes.',
    confirmSkipRevelation: 'Confirmar omissão',
    roleRevelation: 'Revelação dos personagens',
    roleRevelationDescription:
      'Toque em cada jogador para mostrar seu personagem',
    tapToReveal: 'Toque para revelar',
    revealed: 'Revelado',
    startFirstNight: 'Iniciar Noite 1',
    skipRoleRevelation: 'Pular revelações',
    revealAllFirst: 'Revele todos os personagens antes de continuar',
    night: 'Noite',
    nightDashboard: 'Ações noturnas',
    nightDashboardDescription: 'Resolva as ações noturnas em ordem',
    nextAction: 'Próxima',
    actionDone: 'Concluída',
    actionSkipped: 'Pulada',
    actionPending: 'Pendente',
    allActionsComplete: 'Todas as ações noturnas foram resolvidas',
    proceedToDay: 'Avançar para o dia',
    minionStartingInfo: 'Informação dos Lacaios',
    minionStartingInfoDescription: 'Memorize seus aliados do Mal.',
    demonStartingInfo: 'Informação do Demônio',
    demonStartingInfoDescription: 'Seus Lacaios e 3 personagens fora de jogo.',
    selectDemonBluffs: 'Escolher blefes do Demônio',
    selectDemonBluffsDescription: 'Escolha 3 personagens do Bem fora de jogo.',
    theseAreYourBluffs: 'Estes personagens não estão em jogo:',
    nightSteps: 'Etapas da noite',
    stepConfigurePerceptions: 'Definir registros',
    stepShowResult: 'Mostrar resultado',
    stepShowRole: 'Mostrar personagem',
    stepNarratorSetup: 'Preparação do Narrador',
    stepChooseVictim: 'Escolher vítima',
    stepChoosePlayer: 'Escolher jogador',
    stepSelectPlayer: 'Selecionar jogador',
    stepSelectPlayers: 'Selecionar jogadores',
    stepAssignRedHerring: 'Definir Pista Falsa',
    stepSelectAndShow: 'Selecionar e mostrar',
    stepChooseTarget: 'Escolher alvo',
    stepShowMinions: 'Mostrar Lacaios',
    stepSelectBluffs: 'Escolher blefes',
    stepShowBluffs: 'Mostrar blefes',
    stepSelectNewImp: 'Escolher novo Diabrete',
    stepChooseMaster: 'Escolher mestre',
    stepViewGrimoire: 'Consultar Grimório',
    stepShowEvilTeam: 'Sua equipe do Mal',
    noEvilTeammates: 'Sem outros aliados do Mal em jogo',
    stepConfigureMalfunction: 'Definir informação com habilidade inativa',
    playerIsMalfunctioning:
      'A habilidade não funciona com embriaguez ou veneno. A informação pode ser verdadeira ou falsa.',
    chooseFalseNumber: 'Qual número mostrar?',
    chooseFalseResult: 'Qual resultado mostrar?',
    chooseFalseTarget: 'A qual jogador atribuir o personagem na informação?',
    chooseFalseRole: 'Qual personagem mostrar?',
    keepOriginalRole: 'Manter {role}',
    malfunctionWarning: 'Habilidade inativa',
    registrationResultTitle: 'Escolher resultado do registro',
    registrationResultDescription:
      'Este personagem pode se registrar de forma diferente para cada par de vizinhos. Escolha um total permitido para esta informação do Cozinheiro.',
    virginRegistrationTitle: 'Registro para a Virgem',
    virginRegistrationDescription:
      '{player} deve se registrar como Cidadão nesta nomeação?',
    registerAsTownsfolk: 'Registrar como Cidadão',
    registerNormally: 'Registrar como o personagem real',
    setupActions: 'Ações de preparação',
    setupActionsSubtitle:
      'Conclua estas escolhas antes de revelar os personagens.',
    allSetupActionsComplete: 'Todas as ações de preparação concluídas',
    continueToRoleRevelation: 'Revelar personagens',
    perceptionConfigTitle: 'Definir registros',
    perceptionConfigDescription:
      'Escolha como cada personagem se registra para esta habilidade.',
    howShouldRegister: 'Como {player} deve se registrar?',
    registerAsGood: 'Bem',
    registerAsEvil: 'Mal',
    actualRole: 'Real: {role}',
    keepDefault: 'Padrão (sem alteração)',
    keepOriginalTeam: '{team} (padrão)',
    dawnTitle: 'Amanhecer',
    dawnNoDeaths: 'Ninguém morreu durante a noite',
    dawnDeathAnnouncement: '{player} morreu',
    dawnDiedInTheNight: '{player} morreu durante a noite',
    continueToDay: 'Continuar para o dia',
    deathRevealTitle: 'Mortes',
    deathRevealSubtitle: 'Anuncie apenas os nomes.',
    deathRevealDead: 'Morto',
    deathRevealNextDeath: 'Próxima morte',
    deathRevealContinue: 'Continuar',
    nightSummary: 'Detalhes da rodada {round}',
    noDeathsLastNight: 'Ninguém morreu na última noite',
    actionSummary: 'Resumo das ações',
    noActionRecorded: 'Nenhuma ação registrada',
    roleRevelationNarratorHint:
      'Em particular: selecione um jogador e mostre apenas sua revelação.',
    alreadyNominated: 'Já nomeou alguém hoje',
    alreadyBeenNominated: 'Já recebeu uma nomeação hoje',
    handDeviceTo: 'Acorde {player} e mostre a tela',
    tapWhenReady: 'Pronto para olhar',
    audienceNarrator: 'Narrador',
    audiencePlayerChoice: 'Acordar jogador',
    audiencePlayerReveal: 'Mostrar ao jogador',
    storytellerDecision: 'Esta decisão é do Narrador',
    wakePlayerPrompt: 'Acorde {player} e peça que escolha',
    otherPlayers: 'Outros jogadores',
    currentPlayer: 'Jogador atual',
  },
  teams: {
    townsfolk: {
      name: 'Cidadão',
      winCondition:
        'O Bem normalmente vence quando não há Demônio vivo. Habilidades de personagens podem mudar o resultado.',
    },
    outsider: {
      name: 'Forasteiro',
      winCondition:
        'Você é do Bem. O Bem normalmente vence sem Demônio vivo; confira as exceções dos personagens.',
    },
    minion: {
      name: 'Lacaio',
      winCondition:
        'O Mal normalmente vence com apenas 2 jogadores vivos, incluindo um Demônio. Confira as exceções.',
    },
    demon: {
      name: 'Demônio',
      winCondition:
        'O Mal normalmente vence com apenas 2 jogadores vivos, incluindo um Demônio. Confira as exceções.',
    },
  },
  ui: {
    effects: 'Efeitos',
    seeRoleCard: 'Ver personagem',
    editEffects: 'Editar efeitos',
    editEffectConfig: 'Editar efeito',
    currentEffects: 'Efeitos atuais',
    addEffect: 'Adicionar efeito',
    noEffects: 'Sem efeitos',
    close: 'Fechar',
    narrator: 'Narrador',
    unknown: 'Desconhecido',
    unknownPlayer: '[Jogador desconhecido]',
    unknownRole: '[Personagem desconhecido]',
    unknownRoleId: 'Personagem desconhecido: {roleId}',
  },
  history: {
    noEventsYet: 'Nenhum evento ainda',
    gameStarted: 'Partida iniciada',
    nightBegins: 'Começa a Noite {round}',
    sunRises: 'O sol nasce...',
    diedInNight: '{player} morreu durante a noite',
    dayBegins: 'Começa o Dia {round}',
    learnedRole: '{player} descobriu seu personagem: {role}',
    noActionTonight: '{role} não tem ação nesta noite',
    nominates: '{nominator} nomeia {nominee}',
    voteResult: '{player}: {votes} votos ({threshold} necessários). ',
    votePassed: '{player} está prestes a morrer.',
    voteFailed: 'Votos insuficientes.',
    voteTied: 'Empate com {player}. Ninguém está prestes a morrer.',
    executed: '{player} recebeu uma execução.',
    goodWins: 'O Bem venceu.',
    evilWins: 'O Mal venceu.',
    effectAdded: 'O Narrador adicionou {effect} a {player}',
    effectUpdated: 'O Narrador atualizou {effect} em {player}',
    effectRemoved: 'O Narrador removeu {effect} de {player}',
    roleChanged: '{player} passou a ser {role}',
    setupAction: 'Preparação: {player} definido como {role}',
    evilStartingInfoShown: '{player} recebeu a informação inicial do Mal',
  },
  scripts: {
    'trouble-brewing': 'Trouble Brewing',
    custom: 'Partida personalizada',
    selectScript: 'Escolher roteiro',
    selectScriptSubtitle:
      'Escolha os personagens disponíveis e as regras de preparação.',
    enforceDistribution: 'Composição padrão de personagens',
    freeformSelection: 'Personagens e composição livres',
    generateRoles: 'Gerar personagens',
    simple: 'Simples',
    simpleDescription: 'Personagens diretos, fáceis de aprender',
    interesting: 'Variado',
    interestingDescription: 'Mistura de habilidades simples e complexas',
    chaotic: 'Caótico',
    chaoticDescription: 'Máximo de engano e surpresas',
    chaos: 'Caos',
    selectThisPool: 'Selecionar',
    regenerate: 'Gerar novamente',
    orPickManually: 'ou escolha manualmente',
    generate: 'Gerar',
    manual: 'Manual',
    useThisPool: 'Usar conjunto',
    presetApplied: '{preset} aplicado',
    rolesSelected: '{count} personagens escolhidos',
  },
  howToPlay: {
    title: 'Como jogar',
    part1Title: '1. O que é Blood on the Clocktower?',
    p1_nutshellTitle: 'O jogo em poucas palavras',
    p1_nutshell1:
      'Blood on the Clocktower é um jogo de **dedução social**. Este app aceita de 5 a 15 jogadores, além do Narrador.',
    p1_nutshell2:
      'Uma pessoa é o **Narrador**; as outras são **Cidadãos, Forasteiros, Lacaios ou Demônios**.',
    p1_nutshell3:
      'A **equipe do Bem** (Cidadãos e Forasteiros) tenta encontrar e executar o **Demônio**.',
    p1_nutshell4:
      'A **equipe do Mal** (Demônio e Lacaios) tenta matar jogadores suficientes para vencer.',
    p1_nutshell5:
      'O jogo alterna entre **Noite** (habilidades em segredo) e **Dia** (conversa e votação).',
    p1_teamsTitle: 'Equipes e alinhamentos',
    p1_teamTownsfolk:
      'Você é da **equipe do Bem**. Não conhece os outros personagens, mas tem uma habilidade útil. Converse e combine informações para encontrar o Demônio.',
    p1_teamTownsfolkExample: 'Por exemplo, a **Lavadeira** é um Cidadão:',
    p1_teamOutsider:
      'Você é do **Bem**, mas sua habilidade pode atrapalhar sua equipe. Ajude a encontrar o Demônio.',
    p1_teamOutsiderExample: 'Por exemplo, o **Bêbado** é um Forasteiro:',
    p1_teamMinion:
      'Você é da **equipe do Mal**. Proteja o Demônio e engane a vila. Com 7 ou mais jogadores, você começa sabendo quem são o Demônio e os outros Lacaios.',
    p1_teamMinionExample: 'Por exemplo, o **Envenenador** é um Lacaio:',
    p1_teamDemon:
      'Você é da **equipe do Mal**. Use sua habilidade para matar e tente sobreviver. Com 7 ou mais jogadores, você conhece seus Lacaios e três personagens fora de jogo para usar como blefe.',
    p1_teamDemonExample: 'Por exemplo, o **Diabrete** é um Demônio:',
    p1_roundTitle: 'Como funciona uma rodada',
    p1_roundNight:
      'Todos fecham os olhos. O Narrador acorda os personagens em ordem para escolherem ou receberem informações. O Diabrete não mata na primeira noite.',
    p1_roundDay:
      'O Narrador anuncia quem morreu à noite. Os jogadores conversam, acusam e tentam descobrir quem é do Mal.',
    p1_roundNominate:
      'Cada jogador vivo pode nomear alguém uma vez por dia; cada jogador só pode receber uma nomeação por dia. Os votos definem quem está prestes a morrer. A execução ocorre ao fim do dia.',
    p1_roundWinGood:
      'O Bem normalmente vence quando **não há Demônio vivo**. Antes, resolva habilidades que possam impedir ou mudar esse resultado.',
    p1_roundWinEvil:
      'O Mal normalmente vence quando **restam apenas 2 jogadores vivos**, incluindo um Demônio. Algumas habilidades mudam as condições de vitória.',
    p1_roundWinConditions: 'Condições de vitória',
    p1_roundNightLabel: 'Noite',
    p1_roundDayLabel: 'Dia',
    p1_roundNominateLabel: 'Nomeações',
    p1_conceptsTitle: 'Conceitos importantes',
    p1_conceptPoison:
      '**Veneno:** O jogador envenenado não tem habilidade. Finja que ela funciona; as informações podem ser verdadeiras ou falsas. Não revele o envenenamento.',
    p1_conceptDrunk:
      '**Embriaguez:** Assim como o veneno, impede a habilidade de funcionar. A duração depende da origem. O personagem Bêbado acredita ser um Cidadão, mas não tem a habilidade desse Cidadão.',
    p1_conceptDead:
      '**Jogadores mortos:** Continuam conversando e jogando pela equipe. Não podem nomear e têm **um último voto** para usar no restante da partida.',
    p1_conceptStoryteller:
      '**Narrador:** Conduza o jogo, tire dúvidas em particular e acompanhe os personagens. Use o app para registrar o que acontece.',
    part2Title: '2. Como usar o Grimorium',
    p2_createTitle: 'Criando uma partida',
    p2_create1:
      '**Adicionar jogadores:** Digite os nomes (o Narrador não é um jogador).',
    p2_create2:
      '**Escolher roteiro:** Trouble Brewing usa a composição padrão. A partida personalizada permite escolher livremente entre os personagens implementados.',
    p2_create3:
      '**Escolher personagens:** Escolha manualmente ou confira um conjunto sugerido. O gerador verifica a composição, não o equilíbrio da experiência.',
    p2_create4:
      '**Atribuir personagens:** Defina os personagens ou deixe os jogadores com sorteio aleatório.',
    p2_createTip:
      'Em Trouble Brewing, respeite as quantidades mostradas. Partidas personalizadas não exigem essa composição.',
    p2_setupTitle: 'Ações de preparação',
    p2_setup1:
      'Alguns personagens exigem uma escolha do Narrador **antes** do início da partida.',
    p2_setup2:
      'Por exemplo, escolher qual Cidadão o Bêbado acredita ser. O app apresenta cada ação de preparação.',
    p2_revealTitle: 'Revelação dos personagens',
    p2_reveal1:
      'Mostre a cada jogador seu **cartão de personagem** em particular.',
    p2_reveal2:
      'Cada cartão mostra nome, habilidade, alinhamento e condição de vitória.',
    p2_reveal3:
      'Mostre a revelação em particular. Depois, use o toque de um segundo para devolver o aparelho.',
    p2_revealWarning:
      'Mantenha o controle do aparelho. Oculte as informações privadas antes de voltar às telas do Narrador.',
    p2_nightTitle: 'Fase noturna',
    p2_night1:
      'O **painel de ações noturnas** mostra quem precisa agir, na ordem correta.',
    p2_night2: 'Abra a ação marcada como Próxima e siga as etapas.',
    p2_night3:
      'Para **personagens de informação**, confira o resultado e resolva as escolhas do Narrador antes de mostrar.',
    p2_night4:
      'Para **personagens que escolhem um alvo**, registre para quem o jogador apontar.',
    p2_night5:
      'O app aplica os efeitos implementados e sua duração. Confira o Grimório se o resultado for inesperado.',
    p2_nightTip:
      'Se um jogador estiver **bêbado ou envenenado**, escolha uma informação que sua habilidade normalmente permitiria receber. Ela pode ser verdadeira ou falsa.',
    p2_dayTitle: 'Amanhecer e dia',
    p2_day1: '**Amanhecer:** O app anuncia as mortes da noite.',
    p2_day2: '**Dia:** Os jogadores conversam.',
    p2_day3:
      'Abra o **Grimório** para consultar os personagens e estados em particular.',
    p2_day4:
      'Você pode usar **ações diurnas** (como o disparo do Caçador) ou iniciar **nomeações**.',
    p2_voteTitle: 'Nomeações e votação',
    p2_vote1:
      'Escolha um jogador vivo para nomear e quem recebe a nomeação. Cada jogador pode nomear uma vez enquanto vivo e receber uma nomeação por dia.',
    p2_vote2:
      'Marque quem teve o voto contado. Cada pessoa vota ou não vota; não há votos contra.',
    p2_vote3:
      'Para ficar prestes a morrer, é preciso ter ao menos metade dos vivos em votos (arredonde para cima) e superar todas as nomeações anteriores. Um empate válido remove esse estado; as votações seguintes precisam superar a contagem empatada.',
    p2_vote4:
      'Continue as nomeações conforme necessário. A execução usual ocorre ao fim do dia. A Virgem pode causar uma execução imediata e encerrar o dia.',
    p2_endTitle: 'Fim do dia e vitória',
    p2_end1:
      'Confira quem está prestes a morrer antes de encerrar o dia. Uma execução nem sempre causa morte.',
    p2_end2: 'O app verifica continuamente as condições de vitória.',
    p2_end3:
      'O **Bem normalmente vence** quando não resta Demônio vivo após resolver as habilidades.',
    p2_end4:
      'O **Mal normalmente vence** com dois jogadores vivos, incluindo um Demônio. Confira também as condições dos personagens.',
    p2_end5:
      'Ao detectar uma vitória, o app encerra a partida com a tela de resultado final.',
    p2_grimTitle: 'O Grimório',
    p2_grim1:
      'Use o Grimório para consultas privadas do Narrador. O Espião tem uma tela separada, sem edição.',
    p2_grim2:
      'Consulte o **personagem real** de cada jogador, se está vivo ou morto e os efeitos ativos.',
    p2_grim3:
      '**Adicione ou remova efeitos manualmente** para situações que o app não prevê.',
    p2_historyTitle: 'Histórico',
    p2_history1: 'O histórico mostra as ações registradas e seus resultados.',
    p2_history2:
      'Inclui ações noturnas, mortes, votos, execuções e alterações de efeitos.',
    p2_history3:
      'Use para conferir os registros. Ele não mostra eventos nunca registrados nem permite desfazer ações.',
    part3Title: '3. Dicas para jogadores',
    p3_tip1Title: 'Guarde seus segredos',
    p3_tip1Desc:
      'Se for do Bem, escolha com cuidado em quem confiar suas informações. Se for do Mal, minta sobre seu personagem e sua habilidade!',
    p3_tip2Title: 'Converse em particular',
    p3_tip2Desc: 'Compare informações em particular sem contar tudo ao grupo.',
    p3_tip3Title: 'Blefe!',
    p3_tip3Desc:
      'Você pode blefar mesmo sendo do Bem. Decida o que compartilhar de acordo com seu personagem e o que o grupo sabe.',
    p3_tip4Title: 'A morte não é o fim',
    p3_tip4Desc:
      'Em Blood on the Clocktower, os mortos continuam jogando! Fecham os olhos à noite, conversam durante o dia e têm **um último voto** para usar no momento certo.',
    part4Title: '4. Dicas para Narradores',
    p4_firstTitle: 'Para quem vai narrar pela primeira vez',
    p4_first1: 'Comece com **Trouble Brewing**, feito para aprender.',
    p4_first2:
      'Para a primeira partida, considere de 7 a 9 jogadores. Com 5 ou 6, não há a informação inicial usual do Mal.',
    p4_first3:
      'Confira os conjuntos sugeridos antes de usar. Escolha habilidades que consiga explicar ao grupo.',
    p4_first4:
      'Leia as habilidades em jogo e mantenha as regras oficiais à mão. O app não substitui aprender a narrar.',
    p4_duringTitle: 'Durante a partida',
    p4_during1:
      '**Noite:** Siga o painel e confira se cada jogador recebeu a informação pretendida antes de continuar.',
    p4_during2:
      '**Dia:** Deixe os jogadores conversarem. Sua função é facilitar, não controlar a discussão.',
    p4_during3:
      '**Grimório:** Confira personagens e efeitos ativos em particular.',
    p4_during4:
      '**Histórico:** Confira os registros em particular se houver uma divergência. Não revele informações secretas para resolver uma discussão pública.',
    p4_pitfallsTitle: 'Erros comuns',
    p4_pitfalls1:
      'Mostre ao jogador apenas a informação destinada a ele. Mantenha o Grimório e o histórico fora de vista.',
    p4_pitfalls2:
      'Lembre aos mortos que resta um voto. Confirme de quem são os votos registrados.',
    p4_pitfalls3:
      'Informações para quem está bêbado ou envenenado podem ser verdadeiras ou falsas. Escolha algo compatível com a habilidade que a pessoa acredita ter.',
    p4_pitfalls4:
      'Pule uma ação noturna apenas quando as regras permitirem. Se o app fechar durante uma ação incompleta, repita a partir da última ação salva.',
  },
}

export default ptBR
