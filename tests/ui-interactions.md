# Reading and UI interaction checks

## Automated checks

Run from the repository root:

```
node --import tsx --test tests/ui-components.test.tsx
npm run lint
npm run build
```

The component tests cover icon consistency, accessible image triggers, safe server rendering, field-error associations, initially hidden back-to-top controls, and preserving the two unfinished posts as drafts.

## Browser regression checklist

- Blog: expand “On this page”; follow a heading link; confirm the URL hash, scroll position, keyboard focus and brief lavender emphasis. Repeat the same link. Confirm duplicate and Chinese headings receive distinct working anchors.
- Scroll beyond 640px or 90% of the viewport height (whichever is larger); the floating back-to-top button appears. Activate it; scrolling returns to zero and focus moves to the main content. Near the top, the control must be hidden and untabbable.
- Article images: open with click or keyboard; close with Esc, the close button, the enlarged image, or the dimmed background. Confirm body scrolling is restored and focus returns to the image trigger. Preview must fit both wide and narrow screens.
- Contact: submit empty fields, then an invalid email. Each message stays beside its field; focus moves to the first error. Editing clears that field's stale error. Do not send real email during tests; the existing mail-client handoff is unchanged.
- Contact, Wiki password and search fields: inspect label and border focus states, error association, dark theme, and 390px-wide layout.
- Check light/dark selected-text colors, uniform line icons and surface/control/modal radii. Respect the operating system's reduced-motion setting.

## Verification notes

Desktop and 390×844 browser checks exercised image opening, Esc, background/button closing, focus restoration, unique Chinese heading anchors, emphasis events, and contact field validation. A temporary local fixture used an existing image; it was removed after verification and no image was added to published posts.

No cover design was adopted. No article text, project data, authentication rules, database contents, dependencies, GitHub state or deployment settings were changed by this UI work. The previously requested draft flags remain in place.

Local external Wiki data fetching may be restricted by network permissions; verify live data separately in the deployment environment.
