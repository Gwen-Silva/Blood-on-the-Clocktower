export type AbilityGuidance = {
  now: string
  player: string
  note?: string
  example?: string
}
export type NightGuidanceTranslations = {
  title: string
  playerTitle: string
  example: string
  checks: string
  nextTitle: string
  next: string
  dashboard: string
  actions: string
  roles: Record<string, AbilityGuidance>
}

export const nightGuidanceEn: NightGuidanceTranslations = {
  title: 'What to do now',
  playerTitle: 'Character reference',
  example: 'Fictional example',
  checks: 'Storyteller notes',
  nextTitle: 'Next step',
  next: 'Finish the choice or reveal, then put the player to sleep.',
  dashboard: 'Open Next. Complete its steps before advancing to Day.',
  actions: 'Game tools',
  roles: {
    washerwoman: {
      now: 'Choose 2 candidates and the Townsfolk character to show.',
      player:
        'You learn two candidates and one Townsfolk character. One candidate registers as that character; you are not told which.',
      note: 'Review any optional registration. If drunk or poisoned, the configured information may be true or false.',
    },
    librarian: {
      now: 'Choose 2 candidates and an Outsider, or review the offered zero result.',
      player:
        'You learn either two candidates and a particular Outsider character, or that zero Outsiders are in play. You do not learn which candidate is the Outsider. This is starting information, not a new check every night.',
      example:
        '“One of Alice or Bob is the Saint.” These names are fictional; this is not a result for this game.',
      note: 'Five players normally start with zero Outsiders, but Baron changes setup. Spy may register as an Outsider; Recluse can register differently. Drunkenness or poisoning can make information true or false. Follow the available engine choices; a missing legal registration option requires a separate Storyteller ruling, not an invented result or a change to actual roles.',
    },
    investigator: {
      now: 'Choose 2 candidates and the Minion character to show.',
      player:
        'You learn two candidates and a particular Minion character. One candidate registers as that character, but you are not told which.',
      note: 'Recluse registration can affect the result. When drunk or poisoned, information may be true or false; use the configuration offered.',
    },
    chef: {
      now: 'Review the evil-pair count, then show it to the Chef.',
      player:
        'Your starting number counts adjacent evil pairs, including the pair across the end of the seating circle. It is not the total number of evil players.',
      example: 'Three evil players in a row create two neighbouring pairs.',
      note: 'Spy and Recluse registration may affect the count. Review the permitted choices rather than guessing from actual alignments alone.',
    },
    empath: {
      now: 'Review the living-neighbour count, then show it to the Empath.',
      player:
        'Each night you learn how many of your two living neighbours register as evil: 0, 1 or 2. Skip dead neighbours when finding the two living ones.',
      note: 'Optional registrations can change the reading. Drunk or poisoned information may be true or false.',
    },
    fortune_teller: {
      now: 'Wake the Fortune Teller and record their 2 choices.',
      player:
        'Choose two players. You learn whether either registers as a Demon. A good red-herring player can also produce Yes; the answer does not identify which candidate triggered it.',
      note: 'The red herring is chosen during setup. Registration and drunkenness/poisoning can affect the answer; do not disclose the red herring.',
    },
    spy: {
      now: 'Wake the Spy; let them inspect the read-only Grimoire.',
      player:
        'Each night you may inspect the Grimoire shown by the Storyteller. Remember the information, then return the device.',
      note: 'Your registration choices for other abilities remain Storyteller decisions. Follow any malfunction handling offered by the app.',
    },
    poisoner: {
      now: 'Wake the Poisoner and record their target.',
      player:
        'Choose one player each night to poison. You are not told their character or whether their ability was affected.',
      note: 'The engine applies the effect and its expiry. Do not manually overwrite roles or information to represent poisoning.',
    },
    monk: {
      now: 'Wake the Monk and record another player to protect.',
      player:
        'Each night except the first, choose another player to protect from the Demon tonight.',
      note: 'The Monk does not act on Night 1. Use only targets enabled by the app.',
    },
    ravenkeeper: {
      now: 'Wake the Ravenkeeper; record their choice and prepare its character.',
      player:
        'If you die at night, choose a player and learn their character as it registers to your ability.',
      note: 'This is a triggered action, not a routine first-night wake.',
    },
    undertaker: {
      now: 'Review today’s execution death and prepare the character shown.',
      player:
        'Each night except the first, learn the character of the player who died by execution today. If nobody died by execution, there is no such character to learn.',
      note: 'An executed player who did not die is not an execution death. Follow the night list and its recorded result.',
    },
    butler: {
      now: 'Wake the Butler and record another player as master.',
      player:
        'Choose another player each night. Tomorrow you may vote only when that player is also voting. The Storyteller oversees this restriction.',
    },
    imp: {
      now: 'Wake the Imp and record the chosen victim.',
      player:
        'Each night except the first, choose a player to kill. Choosing yourself may pass the Imp to a Minion; the Storyteller resolves the outcome.',
      note: 'No kill on Night 1. Evil starting information is a separate scheduled flow; follow the app’s order and player-count rules.',
    },
  },
}

export const nightGuidanceEs: NightGuidanceTranslations = {
  title: 'Qué hacer ahora',
  playerTitle: 'Referencia de personaje',
  example: 'Ejemplo ficticio',
  checks: 'Notas del Cuentacuentos',
  nextTitle: 'Siguiente paso',
  next: 'Completa la elección o revelación y vuelve a dormir al jugador.',
  dashboard: 'Abre Siguiente. Completa sus pasos antes de pasar al día.',
  actions: 'Herramientas de partida',
  roles: {
    washerwoman: {
      now: 'Elige 2 candidatos y el personaje Aldeano que mostrar.',
      player:
        'Conoces dos candidatos y un personaje Aldeano. Uno se registra como ese personaje; no sabes cuál.',
      note: 'Revisa los registros opcionales. Con embriaguez o envenenamiento, la información puede ser verdadera o falsa.',
    },
    librarian: {
      now: 'Elige 2 candidatos y un Forastero, o revisa el resultado de cero.',
      player:
        'Conoces dos candidatos y un personaje Forastero concreto, o que hay cero Forasteros en juego. No sabes cuál candidato es el Forastero. Es información inicial, no una comprobación nueva cada noche.',
      example:
        '«Alice o Bob es el Santo». Los nombres son ficticios; no es un resultado de esta partida.',
      note: 'Cinco jugadores normalmente empiezan con cero Forasteros, pero el Barón modifica la composición. El Espía puede registrarse como Forastero; el Recluso puede registrarse de otra forma. La embriaguez o el veneno permiten información verdadera o falsa. Sigue las opciones del motor; una opción de registro legal ausente requiere una decisión aparte del Cuentacuentos, no inventar un resultado ni cambiar personajes reales.',
    },
    investigator: {
      now: 'Elige 2 candidatos y el personaje Secuaz que mostrar.',
      player:
        'Conoces dos candidatos y un personaje Esbirro concreto. Uno se registra como ese personaje, pero no sabes cuál.',
      note: 'El registro del Recluso puede afectar el resultado. Con embriaguez o veneno la información puede ser verdadera o falsa; usa la configuración disponible.',
    },
    chef: {
      now: 'Revisa las parejas malvadas y muestra el número al Chef.',
      player:
        'Tu número inicial cuenta parejas malvadas adyacentes, incluida la pareja entre el final y el principio del círculo. No cuenta el total de jugadores malvados.',
      example: 'Tres malvados consecutivos forman dos parejas adyacentes.',
      note: 'Los registros del Espía y del Recluso pueden cambiar el recuento. Revisa las opciones permitidas, no solo los alineamientos reales.',
    },
    empath: {
      now: 'Revisa el recuento de vecinos vivos y muéstralo al Empático.',
      player:
        'Cada noche sabes cuántos de tus dos vecinos vivos se registran como malvados: 0, 1 o 2. Omite a los muertos al buscar a tus vecinos vivos.',
      note: 'Los registros opcionales pueden cambiar la lectura. Con embriaguez o veneno, la información puede ser verdadera o falsa.',
    },
    fortune_teller: {
      now: 'Despierta al Adivino y registra sus 2 elecciones.',
      player:
        'Elige dos jugadores. Sabes si alguno se registra como Demonio. Un jugador bueno marcado como señuelo también puede dar Sí; no sabes quién lo provocó.',
      note: 'El señuelo se elige en la preparación. Los registros, la embriaguez y el veneno pueden afectar la respuesta; no reveles el señuelo.',
    },
    spy: {
      now: 'Despierta al Espía; deja que examine el Grimorio de solo lectura.',
      player:
        'Cada noche puedes examinar el Grimorio que muestra el Cuentacuentos. Recuerda la información y devuelve el dispositivo.',
      note: 'Los registros ante otras habilidades siguen siendo decisiones del Cuentacuentos. Sigue el manejo de mal funcionamiento que ofrezca la app.',
    },
    poisoner: {
      now: 'Despierta al Envenenador y registra su objetivo.',
      player:
        'Cada noche elige a un jugador para envenenarlo. No sabes su personaje ni si afectaste a su habilidad.',
      note: 'El motor aplica el efecto y su caducidad. No cambies personajes ni información manualmente para representar el veneno.',
    },
    monk: {
      now: 'Despierta al Monje y registra a otro jugador para proteger.',
      player:
        'Cada noche salvo la primera, elige a otro jugador para protegerlo del Demonio esta noche.',
      note: 'El Monje no actúa la primera noche. Usa solo los objetivos habilitados.',
    },
    ravenkeeper: {
      now: 'Despierta al Guardacuervos; registra su elección y prepara el personaje.',
      player:
        'Si mueres de noche, elige un jugador y conoce su personaje según se registre ante tu habilidad.',
      note: 'Es una acción por desencadenante, no un despertar habitual de la primera noche.',
    },
    undertaker: {
      now: 'Revisa quién murió por ejecución hoy y prepara el personaje mostrado.',
      player:
        'Cada noche salvo la primera, conoces el personaje de quien murió ejecutado hoy. Si nadie murió ejecutado, no hay personaje que conocer.',
      note: 'Un ejecutado que no murió no cuenta como muerte por ejecución. Sigue la lista nocturna y su resultado registrado.',
    },
    butler: {
      now: 'Despierta al Mayordomo y registra a otro jugador como amo.',
      player:
        'Cada noche elige a otro jugador. Mañana solo puedes votar si ese jugador también vota. El Cuentacuentos supervisa esta restricción.',
    },
    imp: {
      now: 'Despierta al Diablo y registra su víctima.',
      player:
        'Cada noche salvo la primera, elige a un jugador para matarlo. Elegirte puede pasar el Diablillo a un Esbirro; el Cuentacuentos resuelve el resultado.',
      note: 'No mata la primera noche. La información inicial malvada tiene su propio flujo; sigue el orden y las reglas por número de jugadores.',
    },
  },
}
