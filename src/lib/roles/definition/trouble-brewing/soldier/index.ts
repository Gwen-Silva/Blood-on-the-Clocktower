import { RoleDefinition } from '../../../types'
import { registerRoleTranslations } from '../../../../i18n'
import { DefaultRoleReveal } from '../../../../../components/items/DefaultRoleReveal'

import en from './i18n/en'
import es from './i18n/es'
import ptBR from './i18n/pt-BR'

registerRoleTranslations('soldier', 'en', en)
registerRoleTranslations('soldier', 'es', es)
registerRoleTranslations('soldier', 'pt-BR', ptBR)

const definition: RoleDefinition = {
  id: 'soldier',
  team: 'townsfolk',
  icon: 'shield',
  nightOrder: null, // Soldier doesn't wake at night - passive ability
  chaos: 15,

  // Soldier gets permanent Safe effect at game start
  initialEffects: [
    { type: 'safe', data: { source: 'soldier' }, expiresAt: 'never' },
  ],

  RoleReveal: DefaultRoleReveal,

  NightAction: null,
}

export default definition
