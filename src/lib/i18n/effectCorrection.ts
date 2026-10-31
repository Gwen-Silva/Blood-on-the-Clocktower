export const effectCorrectionEn = {
  action: 'Correct latest adjustment',
  title: 'Correct manual effect adjustment',
  limit:
    'Only the latest eligible manual effect adjustment can be corrected. No later game event can be undone here.',
  add: 'Remove the manually added {effect} from {player} and restore the exact state before that adjustment.',
  remove:
    'Restore the removed {effect} on {player}, including its original configuration, expiration and source, and the exact previous game state.',
  update:
    'Restore the previous configuration of {effect} on {player} and the exact state before that adjustment.',
  confirm: 'Confirm correction',
  history: 'Correction: manual adjustment of {effect} on {player} reversed.',
  error:
    'The correction could not be saved. The displayed game and saved data have not been changed. Reload before trying again.',
}
export const effectCorrectionPtBR: typeof effectCorrectionEn = {
  action: 'Corrigir último ajuste',
  title: 'Corrigir ajuste manual de efeito',
  limit:
    'Somente o último ajuste manual elegível pode ser corrigido. Nenhum evento posterior da partida pode ser desfeito aqui.',
  add: 'Remover {effect}, adicionado manualmente a {player}, e restaurar o estado exato anterior ao ajuste.',
  remove:
    'Restaurar {effect} em {player}, com configuração, expiração e origem originais, e o estado exato anterior da partida.',
  update:
    'Restaurar a configuração anterior de {effect} em {player} e o estado exato anterior ao ajuste.',
  confirm: 'Confirmar correção',
  history: 'Correção: ajuste manual de {effect} em {player} desfeito.',
  error:
    'Não foi possível salvar a correção. A partida exibida e os dados salvos não foram alterados. Recarregue antes de tentar novamente.',
}
export const effectCorrectionEs: typeof effectCorrectionEn = {
  action: 'Corregir último ajuste',
  title: 'Corregir ajuste manual de efecto',
  limit:
    'Solo se puede corregir el último ajuste manual válido. Aquí no se puede deshacer ningún evento posterior de la partida.',
  add: 'Quitar {effect}, añadido manualmente a {player}, y restaurar el estado exacto anterior al ajuste.',
  remove:
    'Restaurar {effect} en {player}, con su configuración, vencimiento y origen originales, y el estado exacto anterior de la partida.',
  update:
    'Restaurar la configuración anterior de {effect} en {player} y el estado exacto anterior al ajuste.',
  confirm: 'Confirmar corrección',
  history: 'Corrección: ajuste manual de {effect} en {player} revertido.',
  error:
    'No se pudo guardar la corrección. La partida mostrada y los datos guardados no han cambiado. Recarga antes de intentarlo de nuevo.',
}
