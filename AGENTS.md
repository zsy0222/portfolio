<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project: Personal Portfolio Website

## Project Type
A Next.js (App Router) + React + TypeScript + Tailwind CSS v4 personal portfolio website.

## Tech Stack
- Next.js 16 (App Router, Turbopack)
- React 19
- TypeScript 5
- Tailwind CSS v4 (CSS-based config via `@theme` in `globals.css`)
- Font: DM Sans (via next/font/google)

## Important Files
- `src/app/layout.tsx` — Global layout, DM Sans font, metadata
- `src/app/page.tsx` — Homepage (assembles Sidebar + Hero + Work + About + Footer)
- `src/app/globals.css` — Tailwind v4 `@theme` with custom purple palette
- `src/components/Sidebar.tsx` — Left navigation (22% width, sticky)
- `src/components/Hero.tsx` — Hero section
- `src/components/ProjectCard.tsx` — Work card
- `src/components/About.tsx` — About section
- `src/components/Footer.tsx` — Footer
- `src/data/projects.ts` — Project data (edit this to update content)

## Design System
Color palette (defined in `globals.css` `@theme`):
- `ink` #2a1e3e — titles, active nav
- `accent` #6a4e9e — highlights, hover, buttons
- `body` #b8aec6 — non-active nav, tags
- `lead` #7a4a7e — body text, descriptions (red-purple)
- `muted` #c8c0d0 — section labels, icons, copyright
- `bg` #f0ecf2 — page background
- `line` #e4dce8 — dividers, borders
- `card` #f7f4f8 — card background

Design principles:
- Minimalist: color changes through font weight/value, NOT background blocks
- Left sidebar 22% width, full-bleed to page edge
- 1px dividers between sections, no heavy borders
- Tags use `#tag` format

## Dev Commands
- `npm run dev` — Start dev server (http://localhost:3000)
- `npm run build` — Production build
- `npm run start` — Preview production build
- `npm run lint` — ESLint

## Constraints
- Do NOT change dependency versions in `package.json`
- New components go in `src/components/`
- New pages go in `src/app/` (file-based routing)
- Data files go in `src/data/`
- Images go in `public/images/`
- Keep the purple minimalist design system consistent
- One change at a time — explain plan before writing code

## Blog System
- Blog posts are MDX files in `src/content/{category}/`
- Categories: `research`, `course-notes`, `cross-disciplinary`, `projects`, `career-future`, `casual`
- Frontmatter (required): `title`, `date`, `category`, `summary`
- Frontmatter (optional): `tags` (array), `draft` (boolean, default false)
- Draft posts (draft: true) do not appear in list or RSS
- File naming: kebab-case, e.g. `hybrid-slicing-evolution.mdx`
- Post parsing logic in `src/lib/blog.ts`
- Blog list page: `src/app/blog/page.tsx`
- Blog detail page: `src/app/blog/[slug]/page.tsx`
- Comments: Giscus (GitHub Discussions)
- Code highlighting: Shiki (via rehype-pretty-code)
- When adding a new post: create MDX file in correct category dir, run `npm run build` to verify

## RSS Feed
- Generated at build time as static `feed.xml`
- Route: `src/app/feed.xml/route.ts`
- Single language (Chinese)
- Each item contains: title, link, summary (NOT full text), pubDate, category
- Sitemap auto-generated at `src/app/sitemap.ts`

## Wiki (placeholder)
- Wiki page: `src/app/wiki/page.tsx`
- Currently a placeholder, will be built in step #9
- Wiki content will go in `src/content/wiki/`
