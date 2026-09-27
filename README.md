# Dhairya Singhal — Portfolio

A responsive portfolio for business analysis, data analytics, business intelligence, and digital transformation. Built with semantic HTML, CSS, and vanilla JavaScript; no application framework or runtime dependencies.

## Local development

Node.js 22 or newer and npm are required for development tools.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:4173. Content lives in `index.html`, styling in `style.css`, theme initialization in `theme.js`, and navigation/contact interactions in `script.js`.

## Checks and production preview

```sh
npx playwright install chromium firefox webkit
npm run lint
npm run build
npm test
npm run preview
```

`npm run check` runs lint, build, and browser tests together. Lint includes ESLint and HTML validation. Tests use Playwright and axe across Chromium, installed Google Chrome, Firefox, and WebKit (Safari engine). Chrome must be installed for the `chrome` test project. On macOS, the WebKit tests use Option-Tab to navigate links, matching Safari’s default keyboard behavior. There is no TypeScript source or typecheck step. `node tooling/check-links.mjs` separately checks external HTTP links; a successful HTTP response does not guarantee public dashboard access.

## Deployment

The existing root files remain compatible with GitHub Pages at `https://dhairya-007-ba.github.io/personal_portfolio/`. No deployment workflow was present in the repository. For other static hosts, publish `dist/` after `npm run build`; the build copies only public assets and excludes development tooling and source PDFs. All asset paths are relative to support subdirectory hosting. Update canonical/social URLs, `robots.txt`, and `sitemap.xml` together if the domain changes.

## Theme and accessibility

The OS is the only source of theme preference. CSS `prefers-color-scheme` controls the original light/dark palettes, including without JavaScript. `theme.js` synchronizes browser chrome on live changes and removes the legacy `portfolio-theme` storage key; no manual selection is read or saved. There is no visible theme selector.

The original carousel advances every 12 seconds only while visible. It pauses on pointer hover, focus, touch interaction, a hidden page, or reduced motion. Native touch scrolling and previous/next controls remain; there is no rotation toggle. Timers, animation frames, event listeners and observers are disposed on page exit and restored after back-forward-cache navigation. Reduced motion also stops the hero rotation and animated scrolling. Content and navigation remain available without JavaScript.

## Contact and content

The contact form opens an email draft in the visitor's email app; it does not submit to a server. Fields remain filled so visitors can copy their message if no email app is configured. The icon-only Email button remains available; the address is not displayed as page text. The illustrative hero dashboard is explicitly marked as sample data. Existing metrics, skills self-assessments, education, projects, and employment claims are preserved. The resume PDF was not rewritten and should be updated separately if the new Teaching Assistant appointment should appear there.
