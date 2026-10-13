# Characters, effects and i18n

## Extension points

Read current `src/lib/roles/types.ts`, `effects/types.ts` and `pipeline/types.ts` before extending an ability. Definitions include React components; outdated type examples or a proposed architecture are not substitutes for current types.

Roles under `src/lib/roles/definition/` define team, icon, night order, wake conditions, setup/reveal/night components, initial effects and optional victory checks. Explicit `firstNightOrder`/`otherNightOrder` values override `nightOrder`: null excludes that night, undefined falls back. `nightSteps` supplies metadata governed by [privacy and audiences](privacy-and-audiences.md).

Effects under `src/lib/effects/definition/` supply status restrictions, malfunction, intent handlers, day actions, night follow-ups, victory checks, perception modifiers and optional configuration/description components. Reuse effects for passive abilities. Instances carry data, source and expiry; effect IDs and semantic badge categories are distinct. See [game engine](game-engine.md) for handler priority, registration, source cleanup and role transitions.

## Adding a character

1. Implement the definition/UI using existing components. Model interceptable actions as intents and passive interactions as effects, without character branches in the main controller.
2. Add the ID to `RoleId` in `roles/types.ts` and the definition to `ROLES` in `roles/index.ts`.
3. Include it in appropriate `SCRIPTS` lists in `scripts/index.ts`. Update the separate static `ALL_ROLE_IDS` custom-script list when applicable; it avoids a circular dependency. Script types live in `scripts/types.ts`.
4. Supply translations and behavior tests. Character changes requiring a private reveal use the follow-up described in [game engine](game-engine.md#role-changes-and-follow-ups).

`src/lib/scripts/generator.ts` proposes pools using distribution and chaos metrics. They are composition suggestions, not evidence of balanced games. Distribution modifiers belong on roles and are applied by script helpers.

## Adding an effect

Implement its definition, add its ID to `EffectId` in `effects/types.ts`, and register it in `EFFECTS` in `effects/index.ts`. Include adjacent translations. Choose handler priority from the actual interaction and test competing handlers. `canRegisterAs` declares optional registration; instance data can override it. Use perception/malfunction helpers instead of character-name checks in information abilities.

For effects tied to an owner's continuing ability, inspect `sourcePlayerId` cleanup and expiration. Configuration editors/rich descriptions follow `EffectConfigEditorProps`/`EffectDescriptionProps`; preserve existing UI design.

## Translation ownership

- Role/effect modules import adjacent `i18n/en.ts` and `i18n/es.ts` and call `registerRoleTranslations()` or `registerEffectTranslations()` from `src/lib/i18n/registry.ts`, re-exported by `i18n/index.ts`. Registration occurs when the module loads.
- Shared UI text belongs in `src/lib/i18n/translations/en.ts` and `es.ts`, with `Translations` in `i18n/types.ts`.
- Use `useI18n()`, registry helpers and translated label functions. Do not hardcode user-facing English in React. Add both supported languages for new messages.
- History supports structured i18n/player/role/effect message parts; keep messages localizable rather than flattening them into English.

Explain behavior, decisions and unsupported cases plainly. Avoid slogans, absolute automation claims or promises of balanced compositions. Keep player help separate from implementation details. Preserve original attribution without claiming its author's experiences as Gwen's.

See [testing and verification](../development/testing-and-verification.md) for role, effect and interaction test ownership.
