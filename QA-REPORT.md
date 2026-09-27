# Current local portfolio QA

All work is local. No push, deployment, PR, merge, remote-branch modification, or commit was performed. The original visual identity from `98b9870` remains the design reference; current content continues from the reviewed local state.

## Current changes

- Removed the theme selector, manual preference handling, rotation toggle and its state/styles, and the directly displayed email address.
- CSS reads `prefers-color-scheme` directly. Original palettes, gradients and surfaces are preserved; theme detection works without JavaScript. The small theme script updates browser chrome on OS changes and removes the old `portfolio-theme` key without reading or saving a preference.
- The original carousel automatically advances after 12 seconds of reading time while visible. It pauses for mouse hover, keyboard focus, pointer interaction, hidden documents and reduced motion. Previous/next arrows and native swipe/keyboard access remain. Timers recheck current conditions before advancing, preventing a queued advance after reduced motion is enabled.
- Timers, animation frames, event listeners and intersection observers are disposed on page exit, with initialization restored after back-forward-cache navigation. The hero role animation pauses offscreen, on hidden pages and under live reduced-motion changes.
- Removed obsolete inferred expertise labels from script; the original self-assessed skill bars and percentages remain unchanged.
- Replaced the hero's implied current Project Manager identity with business/data analysis and a project delivery mindset. Career direction explicitly describes growth into project coordination, business systems and project management. Experience copy emphasizes existing reporting, stakeholder needs, documentation and workflows.
- Project descriptions use Business problem / My approach / Impact with existing tools. No stakeholders, constraints or outcomes were invented. Jira moved from the data-tools group to Business & Delivery; all existing skills retained.
- The four-entry timeline remains reverse chronological: Teaching Assistant, Supply Chain Analyst, Junior Business Analyst, Data Research Assistant. SFU TA dates and BUS 217W remain intact. Removed employment claims remain absent from the site and all three repository PDFs.
- The Email icon and email-draft form work without showing the owner's address as page text. This does not hide the destination from HTML source, mail clients or existing PDF documents.

## Preserved intentionally

Original fonts, palette, backgrounds, gradients, hero layout, cards, timeline, logo asset/proportions, metrics, project content and visual animation style. Existing job dates, achievements, education, scores and links were not embellished. No executive/founder/CEO title was added. No new framework, runtime dependency or backend was introduced. The public resume and previously corrected profile PDF were not edited during this pass. Toronto's unavailable dashboard remains requestable by email.

## Bugs addressed

Legacy stored themes could override OS preference; removed the override source. Old carousel pointer handling could leave rotation stopped indefinitely; pointer release/cancel now reschedules. Offscreen/background timers ran unnecessarily; visibility gates prevent this. A queued carousel callback could race a live reduced-motion change; it now rechecks current media state. Global animation/listener lifetimes were implicit; lifecycle cleanup is explicit. Obsolete control spacing and email styles were removed.

## Verification scope

Commands: `npm run lint`, `npm run build`, `npm test`, `node tooling/check-links.mjs`, `node tooling/visual-qa.mjs`, PDF text scans, `git diff --check`, `git status`, `git diff --stat`.

Tests cover Chromium, installed Google Chrome, Firefox and WebKit; native Edge/Safari and physical mobile devices are not claimed. Both themes and live OS changes are checked at 320, 360, 375, 390, 414, 430, 768, 820, 1024, 1280, 1440 and 1920 pixels. Logo loading and proportions, overflow, all page sections, menu keyboard behavior, all carousel links, form validation, metadata, duplicate IDs, local assets and runtime errors are checked. Rotation tests exercise reading delay, hover/focus, live reduced motion and lifecycle cleanup. No-JavaScript checks include both system palettes and navigation.

Visual QA uses 375×812, 390×844, 768×1024, 1440×900 and 1920×1080 in both themes, plus section screenshots and original-design comparisons. Local screenshots are in ignored `test-results/visual/` (the next test run clears this folder).

Automated accessibility checks use axe WCAG 2 A/AA and 2.1 AA tags, plus keyboard review. This is not a complete manual screen-reader or WCAG certification. The owner explicitly requested removal of the carousel pause toggle; interaction pauses and OS reduced motion remain available.

External link checks returned HTTP 200 for all 11 unique remaining HTTPS project/social links. This does not guarantee anonymous access to authenticated Power BI content or future availability. Contact opens the visitor's email application; it does not itself send messages.

No TypeScript exists, so typechecking is not applicable. Production remains eight static assets, with no runtime packages. JavaScript is 13,588 bytes including theme handling. No Lighthouse score or field Core Web Vitals result is claimed. The original logo is 93 KB and remains untouched.

## Final results

Lint, production build and `git diff --check`: PASS. Browser suite: 52/52 PASS. No smoke-test console errors, local asset failures, duplicate IDs or unintended page overflow. Automated axe scans: zero violations in the configured WCAG tag sets. Final section screenshots reviewed: original styling retained, logo legible in both system themes, no space left for removed controls, no displayed email address. All requested widths passed, including live theme changes at each width.

Files changed in this pass: `index.html`, `style.css`, `script.js`, `theme.js`, `tests/portfolio.spec.mjs`, `tooling/visual-qa.mjs`, `README.md`, `QA-REPORT.md`. Other uncommitted/untracked files in Git status belong to earlier authorized local work and remain intact.
