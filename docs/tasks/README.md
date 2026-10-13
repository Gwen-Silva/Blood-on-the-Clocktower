# Task briefs

Task documents are implementation contracts, not design brainstorming. Resolve product/discovery decisions and acceptance criteria before marking a task ready. Use [TEMPLATE.md](TEMPLATE.md); keep briefs small and link relevant [architecture documents](../architecture/README.md) instead of copying their rules.

Every task must include an execution profile. Recommend the smallest model expected to execute the task reliably. Complexity and risk are independent measures. Escalate only for a concrete reason, not merely because the repository is large. The profile is execution metadata, not project-management estimation.

| Status            | Meaning                                                                |
| ----------------- | ---------------------------------------------------------------------- |
| `DRAFT`           | Scope/decisions still need work; not normally handed to implementation |
| `READY FOR CODEX` | Required behavior, boundaries and verification are resolved            |
| `DONE`            | Implementation and required verification are complete                  |

Use a filename such as `014-player-reference.md` and a short handoff: “Implement `docs/tasks/014-player-reference.md`. Do not expand scope. Verify and commit.” This is a naming example, not an existing task or an approved feature.

Normally hand off only `READY FOR CODEX` tasks. Resolve consequential gaps or conflicts before dependent implementation. Completed briefs may remain as lightweight history; they do not override current architecture documentation. Record verification or remaining limitations without estimates, owners or additional project-management metadata.
