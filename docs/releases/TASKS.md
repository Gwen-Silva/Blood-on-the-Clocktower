# Release task tracking

This file records functionality recovered directly on `release/weekend-2026-10-31`.
It does not change historical rebuild status or claim recovery of lost commits.

| Task                                | Current release delivery                                                                                                                      | Evidence                                                                                                    |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| 012 — Safe manual effect correction | Implemented: latest explicit manual edit only, confirmation, exact append-only restoration and save-before-display                            | [Task 012](TASK012.md), `src/lib/__tests__/manualEffectCorrection.test.ts`, `e2e/effect-correction.spec.ts` |
| 016 — Backup & Restore              | Implemented: complete JSON backup, validated preview, explicit conflict decisions and atomic restore; publication evidence in delivery report | [Task 016](TASK016.md), `src/lib/__tests__/gameBackup.test.ts`, `e2e/backup-restore.spec.ts`                |

W01–W08 remain the preceding release baseline. Task 012 and Task 016 functionality
has been recovered in this release. Tasks 013–015 and other historical tasks
are outside these deliveries.
