# Personal Portfolio Website

A minimalist personal portfolio built with Next.js, React, TypeScript, and Tailwind CSS v4.

## Design

Purple-toned minimalist aesthetic. Color is expressed through font weight and value, not background blocks.

| Role      | Hex       | Usage                          |
| --------- | --------- | ------------------------------ |
| Ink       | `#2a1e3e` | Titles, active navigation      |
| Accent    | `#6a4e9e` | Highlights, hover, buttons     |
| Body      | `#b8aec6` | Non-active nav, tags           |
| Lead      | `#7a4a7e` | Body text, descriptions        |
| Muted     | `#c8c0d0` | Section labels, icons          |
| Background| `#f0ecf2` | Page background               |
| Line      | `#e4dce8` | Dividers, borders             |
| Card      | `#f7f4f8` | Card background               |

Font: **DM Sans** (weights 300 / 400 / 500 / 600)

## Project Structure

```
src/
├── app/
│   ├── globals.css       # Tailwind v4 @theme + custom palette
│   ├── layout.tsx        # Global layout + DM Sans font
│   └── page.tsx          # Homepage
├── components/
│   ├── Sidebar.tsx       # Left nav (22%, sticky)
│   ├── Hero.tsx          # Hero section
│   ├── ProjectCard.tsx   # Work card
│   ├── About.tsx         # About section
│   └── Footer.tsx        # Footer
└── data/
    └── projects.ts       # Project data
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build

```bash
npm run build
npm run start
```

## Tech Stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack)
- [React 19](https://react.dev)
- [TypeScript 5](https://www.typescriptlang.org)
- [Tailwind CSS v4](https://tailwindcss.com)
- [DM Sans](https://fonts.google.com/specimen/DM+Sans) via next/font

## Deploy

Deploy on [Vercel](https://vercel.com) — connect the GitHub repo for automatic deployments.
