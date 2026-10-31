# Android Developer Portfolio

A clean, responsive portfolio website for a Senior Android Developer with 9+ years
of experience, built with HTML,
CSS, and vanilla JavaScript. It combines an online resume with project case studies
to help recruiters and potential clients explore your skills and experience.

> This is a sample portfolio. Jean Aira Canillo, the companies, experience, metrics,
> education, and projects are demo content. Replace them before publishing.

## Sample description

Hi, I'm Jean Aira Canillo, a Senior Android Developer with 9+ years of experience building
intuitive, reliable mobile applications. I work with Kotlin, Jetpack Compose, and
modern Android architecture, lead technical decisions, and mentor teams.

Android is my primary expertise. iOS is additional development experience.
AI is self-directed learning and practical experimentation, not an equivalent
professional specialty.

**My signature:** "Android Developer by Experience. Mobile Engineer by Passion.
AI Explorer by Curiosity."

This portfolio highlights my technical skills, selected projects, professional
experience, and education. I'm open to interesting Android development roles,
freelance projects, and remote collaborations.

## Features

- Responsive layouts for mobile, tablet, and desktop.
- Sticky navigation with a thin reading-progress indicator.
- Mobile contact and resume bar with safe-area spacing.
- Day and night themes with teal, violet, and amber accents.
- Time-based theme selection using the visitor's local time: light mode from
  6 AM to before 6 PM, and dark mode overnight.
- Manual theme switching with a saved preference that overrides time-based selection.
- English-only content, including navigation and project details.
- Technical skills organized by category.
- Experience-level positioning: Android (primary, 9+ years), iOS (additional),
  and AI (self-directed learning).
- Separate iOS contribution examples and AI experiment concepts, clearly labeled samples.
- Filterable projects with app mockups and detailed case studies.
- At-a-glance project roles, engineering challenges, and clearly labeled sample outcomes.
- Swipeable mockup galleries with previous/next buttons and keyboard navigation.
- Share buttons that copy direct project links.
- Subtle hover/tap feedback with reduced-motion support and 44px touch targets.
- Sample Google Play links on project cards and in project dialogs.
- Work experience, education, and contact sections.
- Responsive feedback/contact form with full name, optional mobile, email, and message.
- An Email me link and an email-draft action with no backend required.
- Downloadable sample English PDF resume.
- Keyboard-accessible navigation and project dialogs.
- Search metadata, Open Graph and Twitter sharing tags, structured profile data,
  and a crawler configuration.

## Getting started

Open [index.html](./index.html) in a modern browser. No dependency installation,
build step, or backend is required.

You can also serve this folder with a local static web server. Clipboard access
depends on your browser's permissions and secure-context requirements.

### Validation

With Node.js installed, run the dependency-free regression checks:

```powershell
node --check script.js
node --test .tsupgrader\runtime-validation\portfolio.test.cjs
```

These checks cover profile/PDF consistency, gallery assets and navigation,
project filters, and reading-progress calculations. Touch swiping, shared-link
navigation, clipboard fallback, and responsive layouts should also be checked
in a browser after changing interactions.

### Production build

Keep editing the root HTML, CSS, JavaScript, resume, and assets. Generate a
separate minified deployment copy with Node.js 20 or newer:

```powershell
npm.cmd ci
npm.cmd run build
npm.cmd test
```

On macOS/Linux, use `npm` instead of `npm.cmd`. The lockfile pins dependencies.
The build produces `dist/index.html`, `dist/styles.css`, `dist/script.js`,
`dist/resume.pdf`, and public assets. If present, `robots.txt` and `sitemap.xml`
are copied too. Deploy **only `dist`**, not the workspace root.

Do not edit generated files. Rebuild after each source change. The build removes
comments and minifies JavaScript names without source maps; editable originals,
tests, package files, and tooling are not copied. External fonts are not bundled.
Use a dedicated generated output folder, and never place private files in `dist`.

Minification reduces readability and file size, but is **not encryption or access
control**: public HTML, CSS, JavaScript, screenshots, and the resume remain
inspectable and downloadable. No DevTools or right-click blocking is used.

### Secrets and private logic

The current portfolio has no API keys or private server logic and needs no
backend for its email-draft form. Do not add secrets to HTML, browser JavaScript,
JSON-LD, assets, or public configuration—even minified ones. `.env` files are
ignored and are not included by this build, but ignoring a file does not secure
secrets already committed or uploaded.

For future AI features or direct email delivery, call an authenticated backend
or serverless endpoint. Keep provider keys in server-side environment variables
or a secret store; perform validation, authorization, rate limiting, and private
business logic there. Do not return keys to the browser. A backend can keep its
implementation private, but its public endpoints and responses remain observable.
Update the form privacy notice if you switch from email drafts to server delivery.

## Project files

| File | Purpose |
| --- | --- |
| [index.html](./index.html) | Page content, navigation, project links, and SEO markup |
| [styles.css](./styles.css) | Responsive layouts and day/night color schemes |
| [script.js](./script.js) | Theme selection, filters, dialogs, and contact interactions |
| [assets/](./assets/) | Sample SVG app screens for the project galleries |
| [resume.pdf](./resume.pdf) | Sample English resume used by both download links |
| [robots.txt](./robots.txt) | Allows search engines to crawl the published site |
| [tools/build.cjs](./tools/build.cjs) | Generates minified public deployment files |
| [package.json](./package.json) | Build and test commands and pinned build dependencies |

## Personalizing the portfolio

### Identity and experience

Replace the sample name, introduction, location, statistics, work experience,
education, and contact links in [index.html](./index.html). Update the `profile`
object and project case studies in [script.js](./script.js).

The browser-tab icon is an inline SVG in the `rel="icon"` link in
[index.html](./index.html). It displays JEAN above CIR on a navy background,
with teal and amber lettering.

Keep the visible email links and the `profile.email` value consistent so the copy
email action uses the correct address.

### Resume

Replace [resume.pdf](./resume.pdf) with your own PDF, keeping the same filename.
Both download links will use the replacement automatically.

The resume is a static file: editing website text does not update its contents.
Both the website and sample resume are in English.

### Projects, galleries, and sharing

The Android section remains the main professional showcase. The separate iOS
section should describe apps you actually contributed to, with exact roles,
ownership boundaries, and dates. The AI section is for your personal learning,
experiments, and implemented integrations, including limitations and lessons.
Current iOS and AI entries are placeholders, not claims of completed work.

Swift, SwiftUI, Xcode, URLSession, and AI API skills are sample toolkit entries.
Retain only tools you actually used. Do not present the Android experience length
as iOS or AI tenure. No live AI integration is connected to this website.

Edit project roles, challenges, and example results in the project cards in
[index.html](./index.html). Their highlights are reused in the detail dialog.
All current outcome metrics are fictional examples, not measured achievements.
Replace them with results you can substantiate.

The `screenshots` arrays in [script.js](./script.js) define each gallery's image
path, caption, and alternative text. Replace the SVG mockups in [assets/](./assets/)
with your own screenshots and update these paths. Current images are concept
mockups, not screenshots of published apps. The gallery supports native touch
swiping, horizontal scrolling, previous/next controls, and Left/Right/Home/End keys
when the image track is focused.

Share links use `#project-pocket`, `#project-basil`, and `#project-daylight`.
Opening a link automatically opens the matching case study. Browser Back/Forward
and Escape work with project navigation. If clipboard access is blocked, a selected
URL field allows manual copying.

Links copied while using `file:` only work on the same computer. Host the site
over HTTPS before sharing project links with recruiters.

### Contact form

The form creates a `mailto:` draft addressed to `profile.email` in [script.js](./script.js).
It includes the visitor's full name, optional mobile number, email, and message.
Required fields and email format are validated before requesting the draft.

The visitor needs a configured email app and must press Send there. Opening a
draft does not confirm delivery; the website does not submit, store, or log the
form contents, and it keeps the fields intact if the email app fails to open.
The Email me and copy-email actions provide alternatives. Keep the recipient
in the `profile` object and the email links in [index.html](./index.html) consistent.

For direct online delivery later, connect a form service or backend and update
the privacy notice. The current implementation has no external form endpoint.

### Google Play links

The project links use these placeholder package IDs:

- `com.example.pocket`
- `com.example.basil`
- `com.example.daylight`

Replace each ID in [index.html](./index.html) with the package ID of your uploaded
app. Project dialogs automatically reuse their corresponding card links.

Sample URLs may display a missing-app page. Once you add genuine published apps,
also update the sample labels and explanatory notice.

### Colors and themes

Edit the final color variables in [styles.css](./styles.css): `:root` defines
daytime colors, and `body.dark` defines nighttime colors. The primary accent uses
the existing `--green` variable; `--violet` and `--amber` supply the other accents.

If you change the page background colors, update the theme-color values in
[script.js](./script.js) and the initial theme-color meta tag in
[index.html](./index.html).

To test first-visit theme behavior, clear the `portfolio-theme` entry from your
browser's local storage. Old saved language preferences are no longer used.

## Before publishing

1. Replace all demo identity, project, employment, education, and numerical claims.
2. Add your real email, GitHub, LinkedIn, and published app links.
3. Replace the sample PDF resume.
4. Review the English content and project details.
5. Personalize the title, description, author, and JSON-LD profile data.
6. Add your actual canonical URL, `og:url`, and social-sharing image metadata.
7. Create a sitemap with your real public URLs and reference it in
   [robots.txt](./robots.txt).
8. Run the production build, deploy only `dist` to a static host with HTTPS, and
   test downloads, shared project links, and navigation.

Canonical URLs and a sitemap are intentionally not set to a placeholder domain.
Search visibility requires a publicly accessible site; metadata alone does not
guarantee indexing or search rankings.

## Technical notes

- Uses native browser APIs and no JavaScript framework.
- Google Fonts are loaded externally, with local font fallbacks.
- Local storage remembers manual theme preferences.
- If storage is unavailable, the site still uses the time-based theme default
  and logs the storage error.
- The contact form opens an email draft; it has no backend submission or delivery confirmation.
- The fixed mobile actions include bottom safe-area padding; the reading-progress
  bar tracks page scrolling, not scrolling inside a case-study dialog.
- No gallery autoplay is used, and animations respect reduced-motion preferences.
