# Technician Copilot — Interactive Prototype

A polished, clickable prototype of a voice-first troubleshooting assistant
for technicians working on physical equipment. Built for a hackathon
proposal video: **synthetic data, local state, mocked retrieval/voice
behavior** — no external APIs or API keys required.

> Replace the mocks with real STT, an LLM agent, Qdrant, and Rime during the
> hackathon build. See `src/lib/demoEngine.ts` and `src/data/` — that's the
> whole seam.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS (custom industrial color tokens in `tailwind.config.ts`) +
  a small hand-written component stylesheet in `src/app/globals.css`
- [lucide-react](https://lucide.dev) for icons
- IBM Plex Mono / IBM Plex Sans via `next/font/google`

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Click **Start
Troubleshooting** — the scripted three-turn Pump A17 scenario plays through
automatically, pausing after each copilot response until you tap the mic
again.

```bash
npm run build   # production build / type-check
npm run start   # serve the production build
```

## Project structure

```
src/
  app/
    layout.tsx        Root layout, font loading, metadata
    page.tsx           Assembles all components, owns UI-only state (drawers, toast)
    globals.css         Design tokens + component styles
  components/
    TopBar.tsx
    EquipmentCard.tsx
    PipelineStatus.tsx        STT -> AGENT -> QDRANT -> RIME indicator
    ConversationPanel.tsx
    MessageBubble.tsx
    VoiceControl.tsx          Mic button + state label
    RetrievalPanel.tsx
    SourceCard.tsx            Evidence card + loading skeleton
    MachineHistoryDrawer.tsx
    ArchitectureModal.tsx
    SessionSummary.tsx
    Toast.tsx
  data/
    pumpA17.ts          Synthetic equipment, documents, maintenance history
    demoScenario.ts      The exact 3-turn scripted conversation + timings/copy
  lib/
    demoEngine.ts        `useDemoEngine()` — the deterministic state machine
    pipeline.ts           Maps the current phase onto pipeline node states
  types/
    index.ts
```

## The demo scenario

1. *"Pump A17 is vibrating heavily and the temperature is 88 degrees."*
   → retrieves the maintenance manual, Service Report #17, and operating
   specs.
2. *"The bearing temperature is actually 94 degrees."*
   → evidence updates, machine history is recalled.
3. *"No, the pump is already powered down."*
   → the copilot corrects course instead of repeating the restart step.

The state machine is `idle → listening → transcribing → retrieving →
reasoning → speaking → waiting_for_input → … → complete`, with fixed
per-stage delays (`src/data/demoScenario.ts`) so every recording is
identical. Clicking the mic always advances the predefined demo — there's no
real speech recognition wired in, by design (see PRD §17).

## What's real vs. mocked

| Layer | Prototype (today) | Planned (hackathon) |
|---|---|---|
| Retrieval | Hardcoded doc mappings in `pumpA17.ts` | Qdrant vector search |
| Agent reasoning | Scripted responses in `demoScenario.ts` | LLM agent with tools |
| Voice output | Text + waveform animation | Rime Coda / Mist v3 |
| Speech input | Click-to-advance | Real STT |

The in-app Architecture modal states this explicitly so the video/demo never
implies a live backend that isn't there.
