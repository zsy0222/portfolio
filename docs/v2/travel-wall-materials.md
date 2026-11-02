# Version 2 · Travel Wall materials

Status: clickable destination-wall prototype with two organized artwork sets. The latest portrait poster set is displayed by default. Destination names below were transcribed from the supplied artwork; confirm spellings and that each label matches the real trip before publication.

## Folder and preview

- Prototype page: `/v2/travel-wall`
- Poster display assets: `public/images/v2/travel-wall/posters/`
- Earlier landscape concept covers: `public/images/v2/travel-wall/concept-covers/`
- Poster metadata: `src/data/travel-posters-v2.ts`
- Earlier landscape metadata: `src/data/travel-places-v2.ts`
- Clickable wall and detail panel: `src/components/TravelWallV2.tsx`
- The concept artworks were converted from PNG to WebP for the page. One exact duplicate was omitted from the gallery.

## Portrait poster artwork

| # | Draft label from poster | Poster file | Original attachment | Note |
| --- | --- | --- | --- | --- |
| 01 | Wenzhou · Tongpai Island | `01-travel-poster.webp` | `codex-clipboard-4013d6ea-22ce-426e-ba05-db347f36eb0f.png` | Earlier landscape concept says Dongpan Island; confirm the name. |
| 02 | Inner Mongolia · Hulunbuir Grassland | `02-travel-poster.webp` | `codex-clipboard-d2bb6af2-f3cc-4b06-9bc3-8cb6716f27da.png` | — |
| 03 | Wenzhou / Ma'anshan · Caishiji | `03-travel-poster.webp` | `codex-clipboard-0f1702ae-9164-4a3c-8368-a24426e56535.png` | Poster pairs Wenzhou with Caishiji; confirm intended location and title. |
| 04 | Qinghai & Gansu · Chaka Salt Lake | `04-travel-poster.webp` | `codex-clipboard-d7467f67-d5fd-4cda-b9fe-1efbe455b413.png` | — |
| 05 | Xi'an · Giant Wild Goose Pagoda | `05-travel-poster.webp` | `codex-clipboard-d3d1e0cf-bc79-4114-876b-50ef7f0ecc00.png` | — |
| 06 | Nanjing · Xuanwu Lake | `06-travel-poster.webp` | `codex-clipboard-52c97854-6e07-43f1-a6fb-41bc3506ac4a.png` | New place label found in poster set. |
| 07 | Chongqing · Riverfront Night View | `07-travel-poster.webp` | `codex-clipboard-7499ed27-cbba-4566-81fd-e0ea2bc87430.png` | — |
| 08 | Wuxi · Jiangnan Street | `08-travel-poster.webp` | `codex-clipboard-348de30b-0cb9-4021-936a-e293a2c6cb04.png` | Earlier landscape concept says Changnan Street; confirm the name. |
| 09 | Harbin · Ice and Snow World | `09-travel-poster.webp` | `codex-clipboard-894f6c1e-390b-4eb5-bff2-aef0312bbe07.png` | — |
| 10 | Taiwan · Yehliu Geopark | `10-travel-poster.webp` | `codex-clipboard-0d7c077f-7eb9-4c76-bd55-57935903ed6c.png` | — |

## Earlier landscape concept covers

| # | Draft destination label | Artwork file | Original attachment |
| --- | --- | --- | --- |
| 01 | Xi'an · Shaanxi · Giant Wild Goose Pagoda | `01-xian-shaanxi.webp` | `codex-clipboard-397e2199-80e7-4cab-8ded-c4e3de8b67c1.png` |
| 02 | Qinghai & Gansu · Chaka Salt Lake | `02-qinghai-gansu.webp` | `codex-clipboard-37e5a110-0def-4ef4-b0af-67ca53a44d2a.png` |
| 03 | Inner Mongolia · Hulunbuir Grassland | `03-inner-mongolia.webp` | `codex-clipboard-8d5be95f-5b31-414f-b4cb-51a261f88303.png` |
| 04 | Chongqing · Riverfront Night View | `04-chongqing.webp` | `codex-clipboard-fbab16fc-f03d-4553-95ad-a8351133e01e.png` |
| 05 | Wuxi · Jiangsu · Changnan Street | `05-wuxi-jiangsu.webp` | `codex-clipboard-59015944-8f93-4c89-b282-3e99bf804393.png` |
| 06 | Taiwan · New Taipei · Yehliu Geopark | `06-taiwan-new-taipei.webp` | `codex-clipboard-20a83494-e278-4fa0-8e73-19b2b952a6c3.png` |
| 07 | Anhui · Ma'anshan · Caishiji | `07-anhui-maanshan.webp` | `codex-clipboard-1621e33c-18d2-4c1e-ac39-5f644b430f4c.png` |
| 08 | Harbin · Heilongjiang · Ice and Snow World | `08-harbin-heilongjiang.webp` | `codex-clipboard-995f62b6-f77a-488e-90f1-2f86bd7a47f7.png` |
| 09 | Zhejiang · Wenzhou · Dongpan Island | `09-zhejiang-wenzhou.webp` | `codex-clipboard-aeadfd97-9182-44f9-8f14-5d5458e2335f.png` |
| 10 | Malaysia · Kuala Lumpur · Petronas Twin Towers | `10-malaysia-kuala-lumpur.webp` | `codex-clipboard-ee7538da-4639-44e6-b33d-98252b968f56.png` |

`codex-clipboard-21c01d1d-2e69-45cf-866e-b63d9cd93338.png` is byte-for-byte identical to landscape attachment 05, so it is not shown twice.

## Interaction now in place

The page displays the ten portrait posters in a three-column wall. Selecting a poster opens its location journal with slots for photo stories, optional video, and field notes. These slots contain no invented trip details. The panel closes with its button, by clicking outside, or with Escape. The page is responsive and respects reduced-motion preferences.

The page now uses the supplied poster artwork as preview covers. The earlier landscape concepts remain in their own folder. When you provide the real photo sets for each place, add those as separate files and use them inside that place's journal. The room-wall hit target and Three.js camera transition can connect to this page in the later integration step.
