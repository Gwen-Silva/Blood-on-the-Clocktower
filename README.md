# Grimorium

Personal fork of [csansoon/grimorium](https://github.com/csansoon/grimorium), a Storyteller companion for Blood on the Clocktower. This version keeps the original visual design and focuses on clearer instructions and reliable local games. An Android version is a later goal; this repository currently builds a web app.

![Game setup, day phase and history](public/game_management.png)

## What it does

- Set up a game, choose characters and assign them to players.
- Show private character cards and information while the Storyteller holds the device.
- Follow the night order and resolve supported character abilities.
- Track nominations, votes, the execution block and end-of-day execution.
- Inspect character effects and a history of recorded actions.

Trouble Brewing is implemented for 5–15 players, excluding the Storyteller. Custom games use the existing character collection with relaxed setup restrictions. Other editions and Travellers are not implemented. The interface is available in English and Spanish.

The Storyteller still chooses information when required, handles the table and checks uncertain interactions against the [official rules](https://wiki.bloodontheclocktower.com/Rules_Explanation). Suggested character sets respect the supported distribution rules; they are not a guarantee of game balance.

## Local games

Games are stored in this browser on this device. There are no accounts or cloud saves. Clearing site data also clears saved games. This fork does not load Google Analytics or send game events to an analytics service. Fonts are still requested from Google Fonts when a connection is available.

The app can be installed as a PWA and caches its application files for offline use after installation. External fonts may fall back to local fonts offline.

A night action is saved as complete only after its decisions have been resolved. If the app closes before then, repeat that action from the night dashboard. Individual unfinished form selections are not saved.

## Development

Use Node.js 20.19+ or a compatible newer version.

```bash
npm ci
npm run dev
```

```bash
npm test
npm run build
npm run preview
```

The app uses React, TypeScript, Vite, Tailwind CSS and Radix UI. Game history contains state snapshots. Characters and effects define abilities, and an intent pipeline resolves interactions. The rules and UI are still partly coupled; see [AGENTS.md](AGENTS.md) for contribution notes.

## Attribution

Grimorium was created by csansoon. The screenshots and visual design in this fork come from that project. Blood on the Clocktower belongs to The Pandemonium Institute. This is an unofficial project for personal use.

The inherited README declares the code to be MIT-licensed, but this checkout does not include a LICENSE file. That declaration does not cover third-party game content. Original project: [grimorium.app](https://grimorium.app).
