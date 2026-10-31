# Personal fork roadmap

The app is for personal use. Keep the existing visual design. Work in small changes that can be reviewed and tested before expanding the supported rules.

## First change

- Rewrite the README and existing English/Spanish tutorial.
- Correct nomination, voting, victory and drunkenness explanations.
- Remove inherited analytics.
- Commit night actions only after all pending decisions resolve.
- Validate old saves and introduce an explicit save-format version.
- Stop on failed writes and offer a private recovery download.

Interrupted decisions restart from the last committed action. Unfinished choices are not restored. The recovery download remains a safeguard. Task 016 now adds a separate validated general backup/restore interface on the weekend release; see [release tracking](releases/TASKS.md).

## Next

- Delivered on the weekend release: normal backup/restore with validation, preview and explicit conflict confirmation ([Task 016](releases/TASK016.md)).
- Test full browser journeys, reloads, private reveals and failed saves.
- Review Butler voting against the table procedure, including Storyteller corrections.
- Design corrections/undo with explicit consequences for history and revealed information.
- Replace random-sort shuffling and explain the limits of generated character sets.
- Remove empty tests as meaningful interaction coverage is checked.

## Before Android packaging

- Add Portuguese translations across shared UI, characters and effects.
- Separate more rules from presentation where recovery and testing need it.
- Test updates, backgrounding, system back, keyboard and process termination.
- Evaluate Capacitor using the existing React app; avoid a full rewrite without a concrete need.

New scripts and characters come after reliable saved games and real-device validation. Android packaging and additional languages are not included in the first change.
