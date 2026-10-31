const ptBR = {
  name: 'Prefeito',
  description:
    'Ao anoitecer, se houver 3 vivos e ninguém tiver sido executado hoje, sua equipe vence. À noite, outra pessoa pode morrer em seu lugar.',
  quote: 'A vila resiste porque alguém precisa manter a linha.',
  lines: [
    {
      type: 'PASSIVE',
      text: 'Ao anoitecer, se houver 3 vivos e ninguém tiver sido executado hoje, o Bem vence.',
    },
    {
      type: 'PROTECT',
      text: 'Se o Demônio atacar você à noite, outro jogador pode morrer em seu lugar.',
    },
    {
      type: 'WIN',
      text: 'O Bem normalmente vence quando não resta Demônio vivo.',
    },
  ],
}

export default ptBR
