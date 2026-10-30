import { RoleDefinition } from '../../../types'
import { DefaultRoleReveal } from '../../../../../components/items/DefaultRoleReveal'
import { registerRoleTranslations } from '../../../../i18n'

import en from './i18n/en'
import es from './i18n/es'
import ptBR from './i18n/pt-BR'

registerRoleTranslations('saint', 'en', en)
registerRoleTranslations('saint', 'es', es)
registerRoleTranslations('saint', 'pt-BR', ptBR)

const definition: RoleDefinition = {
  id: 'saint',
  team: 'outsider',
  icon: 'starNorth',
  nightOrder: null, // Doesn't wake at night — passive ability
  chaos: 50,

  // Saint gets Martyrdom effect at game start (evil wins if executed)
  initialEffects: [{ type: 'martyrdom', expiresAt: 'never' }],

  RoleReveal: DefaultRoleReveal,

  NightAction: null,
}

export default definition
