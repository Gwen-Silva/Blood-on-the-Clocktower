const ptBR = {
  name: 'Diabrete',
  description:
    'A cada noite, exceto a primeira, escolha um jogador para matar. Se matar a si mesmo dessa forma, um Lacaio vira o Diabrete.',
  quote: 'Ele não conquista. Apenas sobrevive por mais tempo.',
  lines: [
    {
      type: 'NIGHT',
      text: 'A cada noite, exceto a primeira, escolha um jogador para matar.',
    },
    {
      type: 'KILL',
      text: 'Se matar a si mesmo com esta habilidade, um Lacaio vivo vira o Diabrete.',
    },
    {
      type: 'TEAM',
      text: 'Com 7 ou mais jogadores, conheça seus Lacaios e 3 personagens do Bem fora de jogo.',
    },
    {
      type: 'WIN',
      text: 'O Mal normalmente vence com 2 jogadores vivos, incluindo um Demônio.',
    },
  ],
  deflectTitle: 'Ataque desviado!',
  deflectDescription:
    'O Demônio escolheu {target}. Você pode escolher que outro jogador morra no lugar.',
  deflectOriginalLabel: 'alvo original',
  deflectLetMayorDie: 'Deixar {target} morrer',
  roleChangedDescription:
    'Você agora é o Diabrete. A cada noite, escolherá um jogador para matar.',
  selectNewImpTitle: 'Escolher novo Diabrete',
  selectNewImpDescription:
    'O Diabrete matou a si mesmo. Como Narrador, escolha qual Lacaio vivo vira o novo Diabrete.',
  selectMinionToBecome: 'Escolha um Lacaio para virar o Diabrete',
  confirmNewImp: 'Confirmar novo Diabrete',
  demonMinionsTitle: 'Seus Lacaios',
  demonMinionsDescription: 'Estes jogadores estão na sua equipe do Mal.',
  theseAreYourMinions: 'Estes são seus Lacaios:',
  selectBluffsTitle: 'Escolher blefes',
  selectBluffsDescription:
    'Escolha 3 personagens do Bem fora de jogo para mostrar como blefes ao Demônio.',
  selectThreeBluffs: 'Escolha 3 personagens para blefar',
  bluffsSelected: '{count} de 3 escolhidos',
  demonBluffsTitle: 'Seus blefes',
  demonBluffsDescription:
    'Estes personagens do Bem não estão em jogo. Você pode fingir ser um deles.',
  theseAreYourBluffs: 'Estes personagens não estão em jogo:',
  history: {
    choseToKill: '{player} escolheu matar {target}',
    failedToKill: '{player} tentou matar {target}, mas o alvo estava protegido',
    deflectRedirected:
      '{player} escolheu {target}, mas o ataque foi desviado para {redirect}',
    shownMinionsAndBluffs: '{player} viu seus Lacaios e recebeu os blefes: ',
    selfKilled: '{player} (Diabrete) escolheu matar a si mesmo',
    minionBecameImp: '{player} virou o novo Diabrete',
  },
}

export default ptBR
