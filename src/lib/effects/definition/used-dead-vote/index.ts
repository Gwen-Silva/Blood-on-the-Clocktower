import { EffectDefinition } from '../../types'
import { registerEffectTranslations } from '../../../i18n'

import en from './i18n/en'
import es from './i18n/es'
import ptBR from './i18n/pt-BR'

registerEffectTranslations('used_dead_vote', 'en', en)
registerEffectTranslations('used_dead_vote', 'es', es)
registerEffectTranslations('used_dead_vote', 'pt-BR', ptBR)

const definition: EffectDefinition = {
  id: 'used_dead_vote',
  icon: 'vote',
  defaultType: 'nerf',

  preventsVoting: true,

  canVote: () => false,
}

export default definition
