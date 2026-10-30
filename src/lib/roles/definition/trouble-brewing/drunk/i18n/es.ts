const es = {
  name: 'Borracho',
  description:
    'Crees que eres un Aldeano, pero no tienes su habilidad. La información puede ser verdadera o falsa.',
  quote: 'Las noches más cálidas son las que no puedes recordar del todo.',
  lines: [
    { type: 'PASSIVE', text: 'Crees que eres un Aldeano. No lo eres.' },
    {
      type: 'CAVEAT',
      text: 'En lugar de esta carta, ves la carta de otro rol.',
    },
    {
      type: 'CAVEAT',
      text: 'La habilidad que crees tener no funciona. El Cuentacuentos puede darte información verdadera o falsa.',
    },
    {
      type: 'WIN',
      text: 'El bien normalmente gana cuando no queda ningún Demonio vivo.',
    },
  ],

  // SetupAction UI
  drunkSetupTitle: 'Configuración del Borracho',
  drunkSetupDescription:
    'Elige el Aldeano que cree ser; no reveles que es el Borracho.',
  chooseBelievedRole: 'Elige el rol de Aldeano que cree ser',
} as const

export default es
