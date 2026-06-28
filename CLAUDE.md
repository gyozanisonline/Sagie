# CLAUDE.md — Sagie Maya Portfolio

## Project Summary
Next.js 15 portfolio site for graphic designer Sagie Maya.
Currently fetching content from **Storyblok** CMS (draft/published). **Migration to Sanity is planned** — no Sanity code exists yet. When the migration happens, replace `lib/storyblok.js` with a Sanity client and update all page-level data fetches.

## Tech Stack
- **Next.js 15** (App Router, RSC) + React 19
- **TypeScript** (tsconfig present, files are `.jsx` — can migrate)
- **Storyblok** (CMS, client-side bridge for live preview)
- **Lenis** (smooth scroll, via `SmoothScroll` component)
- CSS Modules for all styling

## Key File Map
```
app/
  layout.jsx              # Root layout — Header + SmoothScroll wrapper
  globals.css             # Design tokens (--white, --blue, --brown, --header-height, --gutter)
  page.jsx                # Home: featured projects → HomeCarousel
  page.module.css         # padding-top: 75vh pushes carousel below hero logo
  info/page.jsx           # Bio + portrait (brown bg, blue text)
  work/page.jsx           # All projects → ProjectGrid with filter tabs
  work/[slug]/page.jsx    # Single project → ProjectCarousel (fullscreen fixed)
  components/
    Header.jsx            # Fixed header, hero vs sub-page logo states
    HomeCarousel.jsx      # Horizontal drag carousel (mouse + touch)
    ProjectGrid.jsx       # 3-col grid with category filter tabs
    ProjectCarousel.jsx   # Fullscreen fixed image carousel, ← → keyboard nav
    SmoothScroll.jsx      # Lenis smooth scroll wrapper
    HomeStrip.jsx         # Fixed bottom strip of project thumbnails (flex-grow hover expand, objectFit contain)
    StoryblokBridge.jsx   # Live preview bridge (Storyblok)
lib/
  storyblok.js            # Storyblok API client — replace with Sanity client on migration
```

## Design Tokens (globals.css)
```css
--white:        #ffffff
--off-white:    #fafafa   /* default bg */
--black:        #000000
--off-black:    #1a1a1a
--blue:         #00f9ff   /* info page accent */
--brown:        #26150b   /* info page bg */
--gutter:       8px
--header-height: 34px
--root-columns: 20
```
Font: `"Arial Black"`, weight 900 throughout.

## How to Run
```bash
cd portfolio
npm run dev       # http://localhost:3000
npm run build
npm run start
```

Requires `.env.local`:
```
NEXT_PUBLIC_STORYBLOK_TOKEN=your_token_here
```

## Architecture Notes
- **Home page** hero: logo is in the fixed header at `clamp(48px, 10vw, 120px)`. Page content has `padding-top: 75vh` so the carousel starts below it.
- **Project page** carousel is `position: fixed; inset: 0` — fullscreen takeover. Header renders on top (z-index 100), `← Work` link is visible.
- **Data fetching**: all pages are async RSCs with `revalidate = 60`. Client components are leaf nodes only.

## Current TODOs / Open Work
- [ ] Migrate CMS from Storyblok → Sanity (client-side, no SSR SDK)
- [ ] Add `prefers-reduced-motion` support for carousel transitions
- [ ] Info page: add active nav indicator for `/info` route

## Permissions — What Claude can do freely
- Read any file in this project
- Edit any `.jsx`, `.css`, `.ts`, `.js`, `.json` file
- Run `npm run dev`, `npm run build`, `npm run lint`
- Run `curl localhost:3000` to check dev server
- Create new component files inside `app/components/`
- Add/edit CSS module files
- Update this CLAUDE.md
- Run `git status`, `git diff`, `git log` (read-only git ops)

## Permissions — Ask before doing
- `npm install` / adding new dependencies
- Modifying `next.config.*`
- Changing the CMS layer (`lib/storyblok.js` or future `lib/sanity.js`)
- Architectural changes (routing structure, layout hierarchy)
- Any git commit or push
