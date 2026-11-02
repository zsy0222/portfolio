# Chenmu — Personal Digital World

The upgrade preserves the existing Next.js 16 / React 19 application, original MDX content, Wiki/Turso APIs, course files, comments, RSS and contact routes. Existing dependency versions are unchanged.

## Content ownership and editing

- `src/data/world.ts`: bilingual Creative Lab catalog and project detail sections. Keep `slug` stable; only add `modelUrl`, `videoUrl` and external links when the resource really exists. Existing six projects remain authoritative in `src/data/projects.ts`.
- `src/data/memories.ts`: bilingual travel entries. `kind: "photo"` means an existing original photograph; `pending` leaves a deliberate media placeholder. Do not infer travel dates or routes from an illustration.
- `src/content/`: original MDX articles, untouched. Keep `draft: true` on unpublished work.
- `src/data/article-translations.ts` and `src/content-en/`: opposite-language editions, explicitly labelled translations. The directory name is historical: it also contains the Chinese edition of an English source. Never put duplicate editions under `src/content/`.
- `src/components/world/ArchivePages.tsx`: learning collections and profile. Historic GPA/rank cover freshman year 2025–2026. Volunteer hours remain a historical self-report with an unknown cutoff, not a current total.

## Routes and interaction

`/` is the new editorial entrance. `/world` contains an on-demand Three.js studio. The computer, bookshelf, photo wall and notebook map to ordinary web routes; all routes remain readable without WebGL. `/lab` supports URL-backed categories and search, `/lab/[slug]` and `/projects/[slug]` hold details, `/memories/[slug]` holds travel stories, and `/learning` and `/thoughts` organize existing material.

`/search` and `/api/search` use a server-side, public-only index across projects, article bodies/translated bodies and memories. No language model needs to download for this search. Existing Wiki semantic search is preserved separately; its embedding generator now filters drafts and emits canonical blog URLs.

Global language selection persists when local storage is available. New sections and all six currently published articles have complete Chinese/English editions. Existing database-backed Wiki documents, course PDFs and legacy utility pages retain their authored language and original behavior.

## 3D and media boundaries

The studio is a procedural interpretation, not a photograph or a supplied Blender reconstruction. It uses the specified character clothing and physical objects for navigation. It lazy-loads Three.js, caps pixel ratio, renders on demand, pauses while out of view, honors reduced motion and releases renderer resources on unmount. A WebGL failure retains the HTML navigation and offers retry.

There are no supplied GLB/Blender models or video files in this repository. Other 3D works and films therefore show explicit media placeholders, without invented downloads, playback or finished-render claims. Existing travel photography and artwork are labelled separately.

## Validation and deployment

```sh
npm ci
npm run lint
npx tsc --noEmit
node --import tsx --test tests/*.test.ts tests/*.test.tsx
node scripts/check-content.mjs
npm run build
```

The repository remains connected to Vercel. Branch pushes produce preview deployments when enabled; production follows the existing main branch integration. No new hosting service, database, environment secret or access policy is required.

The managed preview runner in the authoring environment supplies Vite CLI flags that this Next.js app does not accept. Application start scripts are deliberately preserved. Browser verification should use the Vercel deployment preview or normal `npm run dev` in a Next.js-compatible environment.
