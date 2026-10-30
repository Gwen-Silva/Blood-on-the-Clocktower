const ptBR = {
  name: 'Bêbado',
  description:
    'Você acredita ser um Cidadão, mas não tem a habilidade dele. As informações podem ser verdadeiras ou falsas.',
  quote: 'As noites mais acolhedoras são as que você mal lembra.',
  lines: [
    {
      type: 'PASSIVE',
      text: 'Você acredita ser um Cidadão. Não é.',
    },
    {
      type: 'CAVEAT',
      text: 'No lugar deste cartão, você vê o de outro personagem.',
    },
    {
      type: 'CAVEAT',
      text: 'A habilidade que você acredita ter não funciona. O Narrador pode dar informações verdadeiras ou falsas.',
    },
    {
      type: 'WIN',
      text: 'O Bem normalmente vence quando não resta Demônio vivo.',
    },
  ],
  drunkSetupTitle: 'Preparação do Bêbado',
  drunkSetupDescription:
    'Escolha o Cidadão que ele acredita ser; mantenha o Bêbado em segredo.',
  chooseBelievedRole: 'Escolha o Cidadão que ele acredita ser',
}

export default ptBR
