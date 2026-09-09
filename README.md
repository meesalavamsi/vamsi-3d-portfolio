# Vamsi Meesala — Portfolio

A single-page portfolio built for how recruiters actually read: everything visible, structured,
and scannable in 30 seconds — with a printable resume one click away.

**Live:** https://vamsi-3d-portfolio.vercel.app

## Stack

| Layer | Choice |
| --- | --- |
| Framework | React 19 + TypeScript + Vite |
| Styling | Tailwind CSS v4 (CSS-first tokens in `src/index.css`) |
| 3D | Three.js + React Three Fiber (lazy-loaded hero sculpture) |
| Icons | lucide-react (+ inline brand glyphs) |
| Fonts | Self-hosted Inter, Instrument Serif, JetBrains Mono (latin subset, ~292 KB) |
| Deploy | Vercel |

## Structure

```
src/
  data/resume.ts        ← single source of truth for every fact on the page
  components/
    Nav, Hero, Marquee, About, Experience, Work, ProjectVisual,
    Skills, Credentials, Contact, Footer,
    Preloader, CommandPalette, ResumeMode, SectionHeader, Reveal, BrandIcons
  three/Sculpture.tsx   ← lazy-loaded point-cloud hero visual
  lib/hooks.ts          ← in-view, counter, active-section, scroll-progress
```

### Editing content

All copy, metrics, skills, projects, experience and links live in **`src/data/resume.ts`**.
Change it there once and every section — including the printable resume — updates.

## Features

- Structured sections with numbered headers and consistent rhythm
- Animated metric counters, per-project hand-built SVG diagrams
- `⌘K` / `Ctrl+K` command palette: jump to sections, copy email, open links, open resume
- Traditional resume mode — ATS-friendly, prints to A4 (`Print → Save as PDF`)
- SEO: Open Graph + Twitter cards, generated `og.png`, JSON-LD `Person` schema, `noscript` fallback
- Accessibility: skip link, semantic landmarks, visible focus rings, `prefers-reduced-motion` support
- Performance: Three.js code-split out of the initial bundle, no image assets, subset fonts

## Local development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
npm run preview  # serve the build
```

## Deploy

Pushing to `main` triggers a Vercel production deploy automatically.
