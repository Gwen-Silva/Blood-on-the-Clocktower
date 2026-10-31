export const voteCorrectionEn = {
  action: 'Correct latest vote',
  title: 'Correct recorded vote',
  summary: '{player} — recorded tally: {votes}.',
  restore:
    'Cancel this tally and restore the exact state before the vote, including any unused ghost votes. Repeat voting for the same nominee; the nomination is kept.',
  limit:
    'Only the latest complete voting operation in this day can be corrected. No later action or earlier vote can be undone here.',
  prior: 'Before this tally: {player} was about to die with {votes} votes.',
  none: 'Before this tally: nobody was about to die. Qualifying benchmark: {votes}.',
  confirm: 'Confirm vote correction',
  history: 'Correction: the {votes}-vote tally for {player} was cancelled.',
  error:
    'The vote correction could not be saved. The displayed game and saved data have not been changed. Reload before trying again.',
  resume: 'Resume corrected vote',
  pending:
    'This tally was cancelled. Complete voting again for the same nominee before continuing the day.',
  back: 'Back to history',
}
export const voteCorrectionPtBR: typeof voteCorrectionEn = {
  action: 'Corrigir última votação',
  title: 'Corrigir votação registrada',
  summary: '{player} — contagem registrada: {votes}.',
  restore:
    'Cancelar esta contagem e restaurar o estado exato anterior à votação, incluindo os votos de mortos disponíveis. Repetir a votação para o mesmo indicado, mantendo a indicação original.',
  limit:
    'Somente a última votação completa deste dia pode ser corrigida. Nenhuma ação posterior ou votação anterior pode ser desfeita aqui.',
  prior:
    'Antes desta contagem: {player} estava prestes a morrer com {votes} votos.',
  none: 'Antes desta contagem: ninguém estava prestes a morrer. Maior contagem válida: {votes}.',
  confirm: 'Confirmar correção da votação',
  history: 'Correção: a contagem de {player} ({votes}) foi cancelada.',
  error:
    'Não foi possível salvar a correção da votação. A partida exibida e os dados salvos não foram alterados. Recarregue antes de tentar novamente.',
  resume: 'Retomar votação corrigida',
  pending:
    'Esta contagem foi cancelada. Conclua novamente a votação para o mesmo indicado antes de continuar o dia.',
  back: 'Voltar ao histórico',
}
export const voteCorrectionEs: typeof voteCorrectionEn = {
  action: 'Corregir última votación',
  title: 'Corregir votación registrada',
  summary: '{player} — recuento registrado: {votes}.',
  restore:
    'Cancelar este recuento y restaurar el estado exacto anterior a la votación, incluidos los votos de muertos disponibles. Repetir la votación para el mismo nominado, conservando la nominación original.',
  limit:
    'Solo se puede corregir la última votación completa de este día. Aquí no se puede deshacer ninguna acción posterior ni votación anterior.',
  prior: 'Antes de este recuento: {player} iba a morir con {votes} votos.',
  none: 'Antes de este recuento: nadie iba a morir. Mayor recuento válido: {votes}.',
  confirm: 'Confirmar corrección de votación',
  history: 'Corrección: se canceló el recuento de {player} ({votes}).',
  error:
    'No se pudo guardar la corrección de la votación. La partida mostrada y los datos guardados no han cambiado. Recarga antes de intentarlo de nuevo.',
  resume: 'Retomar votación corregida',
  pending:
    'Este recuento fue cancelado. Completa de nuevo la votación para el mismo nominado antes de continuar el día.',
  back: 'Volver al historial',
}
