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
  title: 'What to do now · Storyteller only',
  playerTitle: 'Using your ability',
  example: 'Fictional example',
  checks: 'Registration, malfunction & example',
  nextTitle: 'Next step',
  next: 'Confirm private choices. For a player reveal, show only the prepared screen, then complete protected handback to record it. Put the player to sleep and continue with the next action.',
  dashboard:
    'Keep this screen private. Open the Next action and follow its numbered steps. Wake only that player when instructed. Done means the result was recorded; Proceed to Day unlocks when all required actions are finished.',
  actions: 'Game tools',
  roles: {
    washerwoman: {
      now: 'Prepare two candidates and a Townsfolk character that one can validly register as. Confirm the selection, wake the Washerwoman and show the prepared result; do not reveal which candidate is the match.',
      player:
        'You learn two candidates and one Townsfolk character. One candidate registers as that character; you are not told which.',
      note: 'Review any optional registration. If drunk or poisoned, the configured information may be true or false.',
    },
    librarian: {
      now: 'Open Select Players. With eligible Outsiders, select two candidates and the Outsider character one can register as, then confirm. If the app offers No Outsiders, review that result and choose Show to Player. Wake the Librarian only for the prepared reveal; never show the private picker.',
      player:
        'You learn either two candidates and a particular Outsider character, or that zero Outsiders are in play. You do not learn which candidate is the Outsider. This is starting information, not a new check every night.',
      example:
        '“One of Alice or Bob is the Saint.” These names are fictional; this is not a result for this game.',
      note: 'Five players normally start with zero Outsiders, but Baron changes setup. Spy may register as an Outsider; Recluse can register differently. Drunkenness or poisoning can make information true or false. Follow the available engine choices; a missing legal registration option requires a separate Storyteller ruling, not an invented result or a change to actual roles.',
    },
    investigator: {
      now: 'Choose two candidates and a Minion character that one can validly register as. Confirm, then wake the Investigator and show only the prepared result. Keep the matching candidate secret.',
      player:
        'You learn two candidates and a particular Minion character. One candidate registers as that character, but you are not told which.',
      note: 'Recluse registration can affect the result. When drunk or poisoned, information may be true or false; use the configuration offered.',
    },
    chef: {
      now: 'Review the number of neighbouring evil pairs around the seating circle. Resolve the registration choices or malfunction configuration offered, then wake the Chef and show the number.',
      player:
        'Your starting number counts adjacent evil pairs, including the pair across the end of the seating circle. It is not the total number of evil players.',
      example: 'Three evil players in a row create two neighbouring pairs.',
      note: 'Spy and Recluse registration may affect the count. Review the permitted choices rather than guessing from actual alignments alone.',
    },
    empath: {
      now: 'Check the two nearest living neighbours of the Empath. Resolve any registration or malfunction choices, then wake the Empath and show the prepared number.',
      player:
        'Each night you learn how many of your two living neighbours register as evil: 0, 1 or 2. Skip dead neighbours when finding the two living ones.',
      note: 'Optional registrations can change the reading. Drunk or poisoned information may be true or false.',
    },
    fortune_teller: {
      now: 'Wake the Fortune Teller and ask them to point to two players. Enter their choices privately, resolve the offered registration or malfunction decisions, and show only the yes/no result.',
      player:
        'Choose two players. You learn whether either registers as a Demon. A good red-herring player can also produce Yes; the answer does not identify which candidate triggered it.',
      note: 'The red herring is chosen during setup. Registration and drunkenness/poisoning can affect the answer; do not disclose the red herring.',
    },
    spy: {
      now: 'Wake the Spy and use the dedicated Spy reveal to show the Grimoire. Let them inspect it, then put them to sleep and complete handback. Do not open the editable Storyteller Grimoire for them.',
      player:
        'Each night you may inspect the Grimoire shown by the Storyteller. Remember the information, then return the device.',
      note: 'Your registration choices for other abilities remain Storyteller decisions. Follow any malfunction handling offered by the app.',
    },
    poisoner: {
      now: 'Wake the Poisoner and ask them to point to a target. Select that player on this private screen and confirm. Do not show the role-labelled picker to the player.',
      player:
        'Choose one player each night to poison. You are not told their character or whether their ability was affected.',
      note: 'The engine applies the effect and its expiry. Do not manually overwrite roles or information to represent poisoning.',
    },
    monk: {
      now: 'On relevant later nights, wake the Monk and ask for another player to protect. Select that target and confirm privately.',
      player:
        'Each night except the first, choose another player to protect from the Demon tonight.',
      note: 'The Monk does not act on Night 1. Use only targets enabled by the app.',
    },
    ravenkeeper: {
      now: 'Only when the Ravenkeeper dies at night, wake them and ask for a player. Resolve any registration or malfunction choices and show the prepared character, then complete handback.',
      player:
        'If you die at night, choose a player and learn their character as it registers to your ability.',
      note: 'This is a triggered action, not a routine first-night wake.',
    },
    undertaker: {
      now: 'On a relevant later night, review who died by execution today. Resolve the offered registration or malfunction choices and show the prepared character to the Undertaker.',
      player:
        'Each night except the first, learn the character of the player who died by execution today. If nobody died by execution, there is no such character to learn.',
      note: 'An executed player who did not die is not an execution death. Follow the night list and its recorded result.',
    },
    butler: {
      now: 'Wake the Butler and ask them to choose another player as master. Select that player and confirm; remind the Butler of their voting restriction without revealing other roles.',
      player:
        'Choose another player each night. Tomorrow you may vote only when that player is also voting. The Storyteller oversees this restriction.',
    },
    imp: {
      now: 'On later nights, wake the Imp and ask for a victim. Enter their choice privately and resolve every pending protection or successor decision before continuing.',
      player:
        'Each night except the first, choose a player to kill. Choosing yourself may pass the Imp to a Minion; the Storyteller resolves the outcome.',
      note: 'No kill on Night 1. Evil starting information is a separate scheduled flow; follow the app’s order and player-count rules.',
    },
  },
}

export const nightGuidanceEs: NightGuidanceTranslations = {
  title: 'Qué hacer ahora · Solo Cuentacuentos',
  playerTitle: 'Cómo usar tu habilidad',
  example: 'Ejemplo ficticio',
  checks: 'Registros, mal funcionamiento y ejemplo',
  nextTitle: 'Siguiente paso',
  next: 'Confirma las elecciones privadas. Si hay una revelación, muestra solo la pantalla preparada y completa la devolución protegida para registrarla. Vuelve a dormir al jugador y continúa con la siguiente acción.',
  dashboard:
    'Mantén esta pantalla en privado. Abre la acción Siguiente y sigue sus pasos numerados. Despierta solo a ese jugador cuando se indique. Hecho significa que el resultado se guardó; Pasar al día se habilita al terminar las acciones obligatorias.',
  actions: 'Herramientas de partida',
  roles: {
    washerwoman: {
      now: 'Prepara dos candidatos y un personaje Aldeano como el que uno pueda registrarse válidamente. Confirma, despierta a la Lavandera y muestra el resultado preparado, sin revelar cuál es el candidato correcto.',
      player:
        'Conoces dos candidatos y un personaje Aldeano. Uno se registra como ese personaje; no sabes cuál.',
      note: 'Revisa los registros opcionales. Con embriaguez o envenenamiento, la información puede ser verdadera o falsa.',
    },
    librarian: {
      now: 'Abre Seleccionar jugadores. Si hay Forasteros elegibles, elige dos candidatos y el personaje Forastero como el que uno pueda registrarse; confirma. Si la app ofrece Sin Forasteros, revisa ese resultado y pulsa Mostrar al jugador. Despierta al Bibliotecario para la revelación preparada; nunca muestres el selector privado.',
      player:
        'Conoces dos candidatos y un personaje Forastero concreto, o que hay cero Forasteros en juego. No sabes cuál candidato es el Forastero. Es información inicial, no una comprobación nueva cada noche.',
      example:
        '«Alice o Bob es el Santo». Los nombres son ficticios; no es un resultado de esta partida.',
      note: 'Cinco jugadores normalmente empiezan con cero Forasteros, pero el Barón modifica la composición. El Espía puede registrarse como Forastero; el Recluso puede registrarse de otra forma. La embriaguez o el veneno permiten información verdadera o falsa. Sigue las opciones del motor; una opción de registro legal ausente requiere una decisión aparte del Cuentacuentos, no inventar un resultado ni cambiar personajes reales.',
    },
    investigator: {
      now: 'Elige dos candidatos y un personaje Esbirro como el que uno pueda registrarse válidamente. Confirma, despierta al Investigador y muestra solo el resultado preparado. Mantén secreto cuál coincide.',
      player:
        'Conoces dos candidatos y un personaje Esbirro concreto. Uno se registra como ese personaje, pero no sabes cuál.',
      note: 'El registro del Recluso puede afectar el resultado. Con embriaguez o veneno la información puede ser verdadera o falsa; usa la configuración disponible.',
    },
    chef: {
      now: 'Revisa el número de parejas malvadas adyacentes en el círculo. Resuelve los registros o la configuración de mal funcionamiento y muestra el número al Chef.',
      player:
        'Tu número inicial cuenta parejas malvadas adyacentes, incluida la pareja entre el final y el principio del círculo. No cuenta el total de jugadores malvados.',
      example: 'Tres malvados consecutivos forman dos parejas adyacentes.',
      note: 'Los registros del Espía y del Recluso pueden cambiar el recuento. Revisa las opciones permitidas, no solo los alineamientos reales.',
    },
    empath: {
      now: 'Comprueba los dos vecinos vivos más cercanos del Empático. Resuelve los registros o el mal funcionamiento y muestra el número preparado.',
      player:
        'Cada noche sabes cuántos de tus dos vecinos vivos se registran como malvados: 0, 1 o 2. Omite a los muertos al buscar a tus vecinos vivos.',
      note: 'Los registros opcionales pueden cambiar la lectura. Con embriaguez o veneno, la información puede ser verdadera o falsa.',
    },
    fortune_teller: {
      now: 'Despierta al Adivino y pide que señale a dos jugadores. Introduce sus elecciones en privado, resuelve los registros o el mal funcionamiento y muestra solo el resultado sí/no.',
      player:
        'Elige dos jugadores. Sabes si alguno se registra como Demonio. Un jugador bueno marcado como señuelo también puede dar Sí; no sabes quién lo provocó.',
      note: 'El señuelo se elige en la preparación. Los registros, la embriaguez y el veneno pueden afectar la respuesta; no reveles el señuelo.',
    },
    spy: {
      now: 'Despierta al Espía y usa su revelación dedicada para mostrar el Grimorio. Dale tiempo para mirarlo, vuelve a dormirlo y completa la devolución. No le abras el Grimorio editable del Cuentacuentos.',
      player:
        'Cada noche puedes examinar el Grimorio que muestra el Cuentacuentos. Recuerda la información y devuelve el dispositivo.',
      note: 'Los registros ante otras habilidades siguen siendo decisiones del Cuentacuentos. Sigue el manejo de mal funcionamiento que ofrezca la app.',
    },
    poisoner: {
      now: 'Despierta al Envenenador y pide que señale un objetivo. Selecciónalo en esta pantalla privada y confirma. No muestres al jugador el selector con personajes.',
      player:
        'Cada noche elige a un jugador para envenenarlo. No sabes su personaje ni si afectaste a su habilidad.',
      note: 'El motor aplica el efecto y su caducidad. No cambies personajes ni información manualmente para representar el veneno.',
    },
    monk: {
      now: 'En las noches posteriores que correspondan, despierta al Monje y pide otro jugador para protegerlo. Selecciona el objetivo y confirma en privado.',
      player:
        'Cada noche salvo la primera, elige a otro jugador para protegerlo del Demonio esta noche.',
      note: 'El Monje no actúa la primera noche. Usa solo los objetivos habilitados.',
    },
    ravenkeeper: {
      now: 'Solo cuando el Guardacuervos muera de noche, despiértalo y pide un jugador. Resuelve los registros o el mal funcionamiento, muestra el personaje preparado y completa la devolución.',
      player:
        'Si mueres de noche, elige un jugador y conoce su personaje según se registre ante tu habilidad.',
      note: 'Es una acción por desencadenante, no un despertar habitual de la primera noche.',
    },
    undertaker: {
      now: 'En una noche posterior que corresponda, revisa quién murió ejecutado hoy. Resuelve los registros o el mal funcionamiento y muestra el personaje preparado al Enterrador.',
      player:
        'Cada noche salvo la primera, conoces el personaje de quien murió ejecutado hoy. Si nadie murió ejecutado, no hay personaje que conocer.',
      note: 'Un ejecutado que no murió no cuenta como muerte por ejecución. Sigue la lista nocturna y su resultado registrado.',
    },
    butler: {
      now: 'Despierta al Mayordomo y pide que elija a otro jugador como amo. Selecciónalo, confirma y recuerda la restricción de voto sin revelar otros personajes.',
      player:
        'Cada noche elige a otro jugador. Mañana solo puedes votar si ese jugador también vota. El Cuentacuentos supervisa esta restricción.',
    },
    imp: {
      now: 'En noches posteriores, despierta al Diablillo y pide una víctima. Introduce su elección en privado y resuelve toda protección o decisión de sucesor pendiente.',
      player:
        'Cada noche salvo la primera, elige a un jugador para matarlo. Elegirte puede pasar el Diablillo a un Esbirro; el Cuentacuentos resuelve el resultado.',
      note: 'No mata la primera noche. La información inicial malvada tiene su propio flujo; sigue el orden y las reglas por número de jugadores.',
    },
  },
}
