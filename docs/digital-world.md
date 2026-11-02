# Chenmu — Personal Digital World

The homepage and `/world/*` provide the new editorial world. Existing `/blog`, `/wiki`, `/projects`, `/about`, `/contact`, RSS, database routes and comment components are retained. The previous homepage is at `/archive`.

## Content

`src/data/world.ts` defines bilingual entries, category, status, sections, media provenance and optional real links. Existing project data remains in `src/data/projects.ts`. Original MDX articles are indexed by the server; draft articles are excluded. The new curated entries are bilingual; historical MDX and database-backed Wiki content remain in their original language.

Only add downloads, videos and model previews after the corresponding real files have been connected. Placeholder covers are labeled archive covers, not work previews. The original studio and avatar are AI-assisted concept artwork; Tongpan is an AI-enhanced exhibition concept; the Hulunbuir collage is original personal travel photography from the existing repository.

The GPA/rank refer to the first academic year (2025–2026); volunteer hours have a 2026-10-02 cutoff. No current cumulative performance is inferred.

## Architecture

- `DigitalWorld.tsx`: portable React pages, local bilingual search, filters, native dialogs and language persistence.
- `WorldRoom.tsx`: opt-in lazy Three.js room; raycast computer/books/photos/notebook; orbit controls and three camera presets. On-demand rendering (no idle animation loop), capped DPR, disposed GPU resources.
- `SiteShell.tsx`: new full-width shell for the world while preserving the original sidebar for existing routes.
- `world/[[...path]]/page.tsx`: prerendered file-based detail routes with 404 validation and metadata.
- `scripts/build-world-site.tsx`: generates the same React experience as a static companion for the existing ChatGPT Site. Archive routes link to the existing Vercel origin; this does not migrate database APIs to static hosting.

## Validation

Run `npm run build`, `npx tsc --noEmit`, and `node --import tsx --test tests/world.test.ts`.

To package the static companion: `node --import tsx scripts/build-world-site.tsx /absolute/output/directory`.

The static companion's previous Site is preserved under `/legacy/`. The original Site access policy is retained.

Browser checks: homepage, language persistence after navigation, bilingual search, independent travel detail and image dialog/escape. The testing browser has WebGL disabled; its failure fallback is verified, but the rendered 3D room and picking require a WebGL-capable device. Responsive breakpoints are implemented; physical mobile testing remains outstanding.

## Remaining asset work

The scene is a geometric spatial prototype with the original illustrated character on a plane, not a finished Blender character. Fine GLB models, per-work 360° previews, completed Vlog files, and confirmed daily travel routes are not supplied in this checkout. Full translations of historical MDX/Wiki content remain future content work. These limits are labeled in the UI rather than represented by fake media or invented facts.
