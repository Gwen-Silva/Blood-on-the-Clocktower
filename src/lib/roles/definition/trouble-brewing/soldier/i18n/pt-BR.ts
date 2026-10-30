const ptBR = {
  name: 'Soldado',
  description:
    'Você está protegido do Demônio. Execuções e outras habilidades ainda podem matar você.',
  quote: 'O escudo resiste. Sempre resiste.',
  lines: [
    {
      type: 'PASSIVE',
      text: 'O Demônio não pode matar você.',
    },
    {
      type: 'CAVEAT',
      text: 'Você ainda pode morrer por execução ou outras habilidades.',
    },
    {
      type: 'WIN',
      text: 'O Bem normalmente vence quando não resta Demônio vivo.',
    },
  ],
  soldierInfo: 'Sua proteção',
  permanentlyProtected: 'Protegido do Demônio enquanto a habilidade funciona.',
}

export default ptBR
