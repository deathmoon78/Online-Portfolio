# claude.md — Portfolio Website Design System

> AI instructions for generating UI in this project. All code generations must comply with every rule in this file before outputting.

---

## 1. PROJECT IDENTITY

This is a **personal portfolio website**. The goal is to communicate craft, taste, and technical depth — not just list achievements. Every interaction should feel like meeting the person behind the work: intentional, warm, and quietly confident.

**Audience:** Creative technologists, hiring managers, potential collaborators.
**Tone:** Refined confidence. Editorial without being cold. Playful without being frivolous.

---

## 2. ACTIVE BASELINE CONFIGURATION

```
DESIGN_VARIANCE:  8   (1=Perfect Symmetry → 10=Artsy Chaos)
MOTION_INTENSITY: 6   (1=Static → 10=Cinematic Magic Physics)
VISUAL_DENSITY:   4   (1=Art Gallery → 10=Pilot Cockpit)
```

**AI Instruction:** These are global variables. Drive all decisions in Sections 3–7 from these values. Override them only when the user explicitly requests it in chat.

---

## 3. TECH STACK & ARCHITECTURE

### Framework
- **Next.js (App Router)** with React Server Components as the default.
- RSC for all static layout shells. Extract interactivity into isolated leaf `'use client'` components.
- **INTERACTIVITY ISOLATION:** Any component using Framer Motion, `useMotionValue`, or perpetual animations MUST be a leaf `'use client'` component. Never mix perpetual motion with server data-fetching logic.

### Styling
- **Tailwind CSS v3** — confirm version in `package.json` before generating. Never use v4 syntax in a v3 project.
- CSS custom properties (defined in `globals.css`) for all palette tokens.
- Layouts via **CSS Grid**, never flex-math percentage hacks.

### Animation
- **Framer Motion** for all interactive and entrance animations.
- Spring physics only: `{ type: "spring", stiffness: 100, damping: 20 }` — no linear easing.
- `useMotionValue` + `useTransform` for magnetic/cursor effects. Never `useState` for continuous animations.
- CSS-only animations (`animation-delay`, `@keyframes`) for lightweight ambient effects.

### Icons
- `@phosphor-icons/react` — check `package.json` first.
- Unified `strokeWidth={1.5}` across the entire project.
- **No emojis. Ever.** Replace all symbols with Phosphor icons or clean SVG primitives.

### Dependency Rule
Before importing ANY third-party library, check `package.json`. If missing, output the `npm install` command first.

---

## 4. DESIGN SYSTEM

### 4.1 Color Palette

```css
:root {
  /* Backgrounds */
  --bg-base:        #0d0d0d;   /* Near-black canvas */
  --bg-surface:     #141414;   /* Card / panel surface */
  --bg-elevated:    #1c1c1c;   /* Hover / elevated surface */

  /* Typography */
  --text-primary:   #f0ede8;   /* Warm off-white */
  --text-secondary: #8a8680;   /* Muted warm gray */
  --text-tertiary:  #4a4744;   /* Subtle labels */

  /* Accent — ONE accent, used sparingly */
  --accent:         #c8f542;   /* Electric lime — high contrast, singular */
  --accent-muted:   #8aaa2a;   /* Dimmed accent for secondary uses */

  /* Borders */
  --border-subtle:  rgba(240, 237, 232, 0.06);
  --border-default: rgba(240, 237, 232, 0.10);
}
```

**Rules:**
- **THE LILA BAN:** No purple glows, no blue-to-purple gradients. Banned permanently.
- Max **1 accent color** (`--accent`). Saturation < 80%.
- Warm neutrals only (`--bg-*`, `--text-*`). Do NOT mix warm and cool grays within the same component.
- The accent appears on: active nav indicator, CTA buttons, hover highlights, skill tags. Nowhere else.

### 4.2 Typography

```css
/* In globals.css or layout.tsx */
/* Display: Instrument Serif (editorial, personality) */
/* Body: Geist (clean technical sans) */
/* Mono: Geist Mono (code blocks, metadata) */
```

| Role          | Font              | Size               | Weight | Tracking         |
|---------------|-------------------|--------------------|--------|------------------|
| Hero/Display  | Instrument Serif  | `text-6xl md:text-8xl` | 400  | `tracking-tight` |
| Section Title | Geist             | `text-3xl md:text-5xl` | 500  | `tracking-tighter` |
| Body          | Geist             | `text-base`        | 400    | `tracking-normal` |
| Label/Meta    | Geist Mono        | `text-xs`          | 400    | `tracking-widest` |
| Code          | Geist Mono        | `text-sm`          | 400    | —                |

**Rules:**
- Body paragraphs: `max-w-[65ch] leading-relaxed text-[--text-secondary]`
- **Instrument Serif** is the personality. Use it for the hero name, section pull-quotes, and case study titles only.
- No Inter. No Roboto. No Arial. No Space Grotesk.

### 4.3 Spacing & Layout

- Page container: `max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20`
- Section vertical rhythm: `py-24 md:py-36`
- Full-height sections: **always** `min-h-[100dvh]` — never `h-screen`
- Prefer `CSS Grid` over flex math: `grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8`
- At `DESIGN_VARIANCE: 8`, use asymmetric grids: `grid-template-columns: 2fr 1fr 1fr`, `padding-left: 20vw`, negative margins for overlapping elements

### 4.4 Elevation & Cards

- Cards are used **only** when elevation communicates hierarchy.
- When a shadow is used: tint it toward the background hue, not pure black.
  - Preferred: `shadow-[0_24px_48px_-12px_rgba(0,0,0,0.4)]`
- Default surface: `bg-[--bg-surface] border border-[--border-subtle] rounded-2xl`
- **Glassmorphism** (use for floating panels only):
  ```css
  backdrop-blur-md bg-white/5 border border-white/10
  shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]
  ```

---

## 5. LAYOUT DIRECTIVES

### 5.1 Hero Section
- **ANTI-CENTER BIAS:** Centered hero is banned at `DESIGN_VARIANCE: 8`.
- Use: **Left-aligned text / Right-aligned visual asset** (project preview, 3D element, or SVG illustration).
- OR: **Asymmetric split** with name large-left, status/role small-right, and a full-bleed media element breaking the grid.
- Include: name in Instrument Serif, role/tagline in Geist Mono (`text-[--text-tertiary]`), one CTA.

### 5.2 Navigation
- Sticky, minimal. `fixed top-0 w-full z-40` with `backdrop-blur-md bg-[--bg-base]/80`.
- Left: logo/name monogram. Right: nav links + optional "Available for work" status dot.
- Active state: `--accent` underline or dot indicator. No filled backgrounds on nav items.

### 5.3 Work/Projects Section
- **Do not** use a simple 3-column card grid.
- Use one of:
  - **Asymmetric Bento** — `grid-template-columns: 2fr 1fr` with one featured case study large-left
  - **Accordion Image Slider** — vertical strips that expand on hover
  - **Horizontal Scroll Hijack** — scroll direction translates to a smooth horizontal pan
- Each project tile: project name outside/below the visual frame (gallery style, not inside the card)

### 5.4 About Section
- Split screen: photo/visual left, text content right.
- Pull a key quote into Instrument Serif italic at larger scale.
- Skills listed as `Geist Mono` tags — no pill cards, just `text-xs tracking-widest text-[--accent]` on a `border-b border-[--border-subtle]` row.

### 5.5 Contact Section
- Minimal. Full bleed. Large typographic CTA in Instrument Serif.
- One primary action button (email). Social links in `Geist Mono text-xs`.
- Optional: ambient animated mesh gradient background layer (`pointer-events-none fixed`).

---

## 6. MOTION SYSTEM

At `MOTION_INTENSITY: 6`, the following are **mandatory**:

### Entrance Animations
- All sections use **staggered orchestration** on scroll entry.
- `staggerChildren: 0.08` with `initial: { opacity: 0, y: 24 }` → `animate: { opacity: 1, y: 0 }`.
- Parent `variants` and children must be in the **same Client Component tree**.

### Magnetic Buttons
- Primary CTAs use magnetic pull toward cursor.
- Implement via `useMotionValue` + `useTransform` — **never `useState`**.
- Displacement: `±12px` max. Spring: `{ stiffness: 150, damping: 15 }`.

### Hover States
- Project tiles: subtle `scale(1.02)` + `border-[--accent]/20` glow.
- Nav links: `--accent` underline slides in from left.
- Tactile feedback on button `:active`: `scale-[0.97] -translate-y-[1px]`.

### Ambient / Perpetual
- Status dot (if "available for work"): infinite `opacity` pulse.
- Hero background: slow mesh gradient animation (`@keyframes` CSS only, on `pointer-events-none` pseudo-element).
- **Performance:** All perpetual animations isolated in their own `React.memo` Client Components.

### Performance Rules
- Animate **only** `transform` and `opacity`. Never `top`, `left`, `width`, `height`.
- Grain/noise overlays: `fixed inset-0 pointer-events-none z-50` only — never on scrolling containers.
- `z-index` only for systemic layers: sticky nav (`z-40`), modals (`z-50`), overlays (`z-30`).

---

## 7. COMPONENT INTERACTION STATES

Every interactive component must implement the full cycle:

| State   | Implementation |
|---------|----------------|
| **Default** | Designed base state |
| **Hover** | Transform + color shift (no layout shift) |
| **Active/Press** | `scale-[0.97]` tactile depression |
| **Loading** | Skeletal shimmer matching layout dimensions — no spinners |
| **Empty** | Beautifully composed empty state with guidance text |
| **Error** | Inline error below the field, `text-rose-400 text-sm` |
| **Success** | Accent-colored confirmation, optionally particle burst |

---

## 8. PRE-FLIGHT CHECKLIST

Run this before every code output:

- [ ] No `h-screen` — using `min-h-[100dvh]` for all full-height sections
- [ ] No centered hero layout — asymmetric or split-screen only
- [ ] No purple/blue gradients anywhere
- [ ] No emojis in any markup, content, or alt text
- [ ] No `Inter`, `Roboto`, `Arial`, or `Space Grotesk`
- [ ] Accent color (`--accent`) used in max 3 places per view
- [ ] Perpetual animations isolated in `React.memo` leaf Client Components
- [ ] `useMotionValue` used for magnetic/cursor effects (never `useState`)
- [ ] All libraries verified in `package.json` before import
- [ ] Mobile collapse guaranteed: `w-full`, `px-4`, `max-w-7xl mx-auto` in place
- [ ] Cards used only when elevation communicates hierarchy
- [ ] Stagger orchestration: parent `variants` and children in same Client Component tree
- [ ] `z-index` used only for systemic layer contexts
- [ ] Grain/noise overlays on `fixed` pseudo-elements only

---

## 9. WHAT NOT TO BUILD

These patterns are banned in this project:

- Generic 3-column equal card grids
- Purple/blue gradient hero sections
- Centered H1 with centered paragraph below it
- Circular spinners for loading states
- Emoji decorations
- `h-screen` for any viewport-height section
- `justify-center` on the hero at variance level 8
- Inline CSS `style` props for layout (use Tailwind or CSS vars)
- Arbitrary `z-50` stacking without systemic reason
- `calc(33% - 1rem)` flex-math — use Grid

---

*Last updated: May 2026 — sync with `Taste-Skill.md` and `Front-End-Skill.md` for base rules.*
