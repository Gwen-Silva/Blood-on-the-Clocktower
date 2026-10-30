const es = {
  name: 'Virgen',
  description:
    'La primera vez que te nominan, si quien nomina se registra como Aldeano, recibe una ejecución inmediata.',
  quote: 'La inocencia es la hoja más afilada. Pero solo corta una vez.',
  lines: [
    {
      type: 'PASSIVE',
      text: 'La primera vez que te nominan, si quien nomina se registra como Aldeano, es ejecutado inmediatamente.',
    },
    {
      type: 'INFO',
      text: 'Si quien nomina no se registra como Aldeano, nada sucede y la nominación continúa.',
    },
    {
      type: 'CAVEAT',
      text: 'Esta habilidad se gasta tras la primera nominación, sin importar el resultado.',
    },
    {
      type: 'WIN',
      text: 'El bien normalmente gana cuando no queda ningún Demonio vivo.',
    },
  ],

  // History
  history: {
    townsfolkExecuted: '¡{nominator} nominó a la Virgen y fue ejecutado!',
    lostPurity:
      '{nominator} nominó a la Virgen: el poder de la Virgen se ha agotado',
  },
} as const

export default es
