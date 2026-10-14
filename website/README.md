# Hakaisatsu website

The public website is an independent Astro + React + TypeScript project in this repository. It builds static files for GitHub Pages at `/hakaisatsu/`; it does not add dependencies to the distributed Skill.

## Development

Use Node.js 22.12 or newer (CI uses Node 22).

```sh
cd website
npm ci
npm run dev
# Open the printed local URL with /hakaisatsu/ appended.
npm run check
npm run build
npm test
npm run preview
```

TypeScript stays on the supported 6.x line because the Astro checker currently requires its programmatic API.

## Source ownership

- `src/pages/*.astro`: five English pages and reusable Chinese route wrappers. Existing English file URLs remain available; the Chinese homepage builds as `zh.html`, with four pages under `zh/`.
- `src/layouts/SiteLayout.astro` and `src/components/Navigation.astro`: shared document and navigation.
- `src/components/Brand.tsx`: shared server-rendered React identity; no unnecessary hydration is shipped. Future interactive React components can opt into Astro client directives.
- `src/components/GalleryCard.astro` and `src/data/gallery-presentation.mjs`: shared gallery presentation. The existing artifact builder imports the same card renderer and curated case metadata.
- `src/data/site.ts`: version and content derived from the Skill package, canonical recipes and validated gallery manifest. Do not paste generated recipe JSON into pages.
- `src/styles/` and `src/scripts/`: the original page styles and behavior, preserved for migration parity. Tailwind utilities use `tw:` prefixes and omit Preflight so existing CSS classes and variables retain their behavior.
- `public/`: new website-only static files. Existing `docs/` assets remain canonical because README links, standalone cases, update manifests and artifact tooling already use them. `scripts/stage-public.mjs` stages only Git-tracked files, rejects symlinks and URL collisions, and never modifies source files (stage new static assets with `git add` before previewing them); Astro owns the four top-level pages.

`docs/index.html`, `docs/gallery.html`, `docs/guide.html`, `docs/start.html` and the legacy page templates remain compatibility/visual baselines in this migration. They are **not** the deployed page source. Do not implement website features in those snapshots. The legacy builders still support artifact generation and existing integrations; the production website reads the underlying shared data directly. When deliberately changing the design or content in a later PR, review and update the baseline assertions explicitly rather than silently refreshing them.

## Validation and publishing

`npm test` compares the built DOM, original CSS, text, scripts and accessibility attributes with the migration baseline and verifies byte-identical preservation of every existing non-page public file. Generated recipe JSON is compared semantically.

The existing real Chrome integration suite can run against the built site, including its `/hakaisatsu` deployment prefix:

```sh
HAKAISATSU_SITE_ROOT="$PWD/dist" HAKAISATSU_SITE_INTEGRATION=1 \
HAKAISATSU_CHROME="/path/to/chrome" \
npm run test:browser
```

CI builds/tests the website when website inputs change and on every main push. It uploads `website-dist`; the existing protected Pages deployment downloads that exact verified artifact. Build output, caches and staged assets are ignored by Git. Existing GitHub required checks and obsolete-deployment protection remain in place.

The migration visual receipt is in `test/evidence/visual-parity.json`. Full-page comparisons use identical browser/viewports and wait for fonts. Animation is frozen and iframe pixels are hidden in both versions; iframe files are instead verified byte-for-byte, and unmasked pages are inspected separately.

## Search and AI discovery

The ten main language pages contain their translated body text, metadata and recipe references before JavaScript runs. Language links navigate to real URLs; URL language takes precedence over stored preferences. Existing `?lang=` entry links migrate to the matching route and preserve other parameters and fragments. Guide drafts survive a language switch once in session storage, expire after 30 seconds, and are never placed in the URL or sent over the network.

`src/data/site-urls.mjs` defines the preferred `https://thomasardi.github.io/hakaisatsu` URLs. Each language has its own canonical and reciprocal `en`/`zh-Hans`/`x-default` links. Pages is served under the repository base path `/hakaisatsu`, and canonical, sitemap and social-preview URLs include it. If you later move to a custom domain, change `canonicalOrigin` in that file together with `siteTarget` in `scripts/site-target.mjs`. Release identity and recipes come from this checkout: stable and development builds must not advertise each other's capabilities.

The build produces `robots.txt` and `sitemap.xml` from the ten pages and the curated gallery inventory. It checks each advertised artifact's original manifest hashes before adding an explicitly marked metadata block in the deployed HTML head; exported source files, SVG, scripts and updater bytes retain their existing contracts. Source JSON remains accessible; GitHub Pages cannot set an `X-Robots-Tag` response header for it.

After publication, verify the actual GitHub Pages response, including robots rules, redirects and sitemap URLs. Submit the deployed sitemap to verified Google Search Console and Bing Webmaster Tools properties, then inspect real crawl and index results. Google AI controls, search impressions and Bing AI citation reports are separate account observations; successful builds and submissions do not establish rankings or AI citations. Avoid fabricated ratings, install statistics or daily sitemap modification dates. Search access and AI training permissions are independent decisions.
