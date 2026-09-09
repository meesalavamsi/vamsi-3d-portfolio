# 🎮 VAMSI MEESALA — 3D Game Portfolio

A story-driven, game-based interactive portfolio. Visitors play as **PLAYER**, exploring a
futuristic 3D world where every location is a chapter of Vamsi's resume — education, skills,
experience, projects, certifications, and coding journey.

## ✨ Features

- **Cinematic boot sequence** → title screen → avatar intro dialogue
- **3D world map** (React Three Fiber) with 9 unlockable locations, hover glow, click-to-enter, WASD player avatar, `[E]` interact prompts
- **Mission & XP system** — 9 missions, 6 player levels, persistent save (localStorage)
- **8 hidden achievements** with toast notifications
- **Locations**: Home Base, University (animated CGPA ring), Skill Lab (playable Linux terminal), ServiceNow HQ (animated stats + clickable workflow pipelines), Project City (4 project interiors incl. a live energy graph), Cyber Arena (timed quiz minigame + leaderboard), Certification Vault (unlock cards), Algorithm Arena (skill XP bars), Mission Control (contact + finale)
- **Cinematic ending** when all missions are complete
- **Traditional Resume Mode** — clean, printable (Print → Save as PDF), always one click away
- **HUD**: identity, level/XP bar, missions panel, SVG mini-map, sound toggle
- **Sound**: WebAudio-synthesized SFX (no assets), off by default, subtle ambient hum
- **Accessibility**: skip-intro, resume fast-lane, keyboard navigation, `prefers-reduced-motion` support, WebGL-unavailable 2D fallback
- **Mobile**: simplified camera, touch controls, action bar (Map / Missions / Resume)
- **Performance**: lazy-loaded 3D chunks, instanced particles, no external model files

## 🧱 Tech Stack

React 19 · TypeScript · Vite · Three.js + React Three Fiber + drei · Tailwind CSS 4 ·
Framer Motion · Zustand · Lucide icons

## 🚀 Run locally

```bash
npm install
npm run dev        # http://localhost:5173
```

## 📦 Build

```bash
npm run build      # outputs dist/
npm run preview    # preview the production build
```

## ☁️ Deploy to Vercel

1. Push this folder to a GitHub repo.
2. In Vercel: **New Project → Import repo**. Vercel auto-detects Vite (`vercel.json` included).
3. Deploy. Done.

Or with the CLI: `npx vercel --prod`

## ✏️ Edit content

All resume facts live in **one file**: `src/data/resume.ts`
(name, email, LinkedIn/GitHub URLs, skills, experience, projects, certifications, XP, levels).

> ⚠️ Update `identity.linkedin` in `src/data/resume.ts` with your real LinkedIn URL (currently a placeholder).

## 🗺 Structure

```
src/
├── data/resume.ts        # single source of truth (resume + game config)
├── store/gameStore.ts    # zustand: XP, missions, achievements, phases
├── utils/sound.ts        # WebAudio synth SFX + ambient
├── three/                # WorldMap, Effects (particles/avatar/grid), title & intro scenes
├── components/           # HUD, MissionPanel, MiniMap, Toasts, DialogueBox, SectionShell, widgets…
└── sections/             # HomeBase, University, SkillLab, ServiceNowHQ, ProjectCity (+projects/),
                          # CyberArena, CertVault, CodingArena, MissionControl
```
