import { RoleDefinition } from '../../../types'
import { DefaultRoleReveal } from '../../../../../components/items/DefaultRoleReveal'
import { registerRoleTranslations } from '../../../../i18n'

import en from './i18n/en'
import es from './i18n/es'
import ptBR from './i18n/pt-BR'

registerRoleTranslations('scarlet_woman', 'en', en)
registerRoleTranslations('scarlet_woman', 'es', es)
registerRoleTranslations('scarlet_woman', 'pt-BR', ptBR)

const definition: RoleDefinition = {
  id: 'scarlet_woman',
  team: 'minion',
  icon: 'rose',
  nightOrder: null,
  chaos: 50,
  initialEffects: [{ type: 'demon_successor', expiresAt: 'never' }],
  RoleReveal: DefaultRoleReveal,
  NightAction: null,
}

export default definition
