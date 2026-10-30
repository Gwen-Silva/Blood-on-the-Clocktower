import { RoleDefinition } from '../../../types'
import { DefaultRoleReveal } from '../../../../../components/items/DefaultRoleReveal'
import { registerRoleTranslations } from '../../../../i18n'

import en from './i18n/en'
import es from './i18n/es'
import ptBR from './i18n/pt-BR'

registerRoleTranslations('baron', 'en', en)
registerRoleTranslations('baron', 'es', es)
registerRoleTranslations('baron', 'pt-BR', ptBR)

const definition: RoleDefinition = {
  id: 'baron',
  team: 'minion',
  icon: 'hatTop',
  nightOrder: null,
  chaos: 40,
  distributionModifier: { outsider: 2, townsfolk: -2 },
  RoleReveal: DefaultRoleReveal,
  NightAction: null,
}

export default definition
