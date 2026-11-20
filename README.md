# For Our Brother

## [▶ View live demo](https://bekuuu1.github.io/for-our-brother/)

Open the birthday film in your browser. No cloning, installation, or sign-in needed.

A cinematic birthday film for **Emil Shaibek uulu (Emil Baike)**. Seven chapters, animated memory phrases, a heartfelt letter, an interactive gift and birthday cake, and bilingual closing credits.

## Run

No build step or production package installation is needed. Open `index.html`, or run `python3 -m http.server 8000` in this directory and visit http://localhost:8000.

## Personalize

- **Memories:** animated words replace the photo gallery; no photographs are required. Edit the ribbon in `index.html`.
- **Messages:** edit the chapter text and letter in `index.html`. Captions and memory notes are together in `js/main.js`.
- **Music:** the default is an original quiet Web Audio melody. To use your own licensed recording, add it to `assets/music/` and set `film.music` in `js/main.js`. Sound is enabled by default and starts on the first click, tap, or keyboard interaction (browser autoplay policy). Mute remains respected until explicitly enabled again. The tab pauses audio when hidden. No microphone permission is required to blow out the candles.
- **Colors and type:** edit the custom properties and font rules in `css/styles.css`. Fonts are self-hosted; licenses are in `assets/fonts/`.

## Deploy

This repository is a static site and supports GitHub Pages, Netlify, and Vercel.

**GitHub Pages:** in Settings → Pages, select “Deploy from a branch”, `main`, `/ (root)`, then Save. The demo URL is `https://bekuuu1.github.io/for-our-brother/` once GitHub finishes the build. The repository and demo are public; add only photos and recordings you want publicly accessible.

**Netlify:** drag this folder into Netlify's manual deploy, or import the repository without a build command and with `.` as the publish directory.

**Vercel:** import as Other, with no build command and `.` as the output directory.

## Checks

Install test tools with `npm install`, then `npx playwright install chromium` and `npm test`. To test an installed Chrome instead, set `CHROME_PATH` to its executable. To check a deployed version, set `TEST_URL` to its URL.

The smoke test checks all seven chapters, audio controls, absence of photo placeholders, notes, envelope, candle states, replay, horizontal overflow at four viewport widths, reduced motion, and browser/network errors. Screenshots go in ignored `test-results/`.

Motion respects the OS reduced-motion setting and can be paused manually. Interactive controls use native buttons, links, and a modal dialog. the cake announces state changes, and the candles are lit automatically when the gift opens.

## Credits

Original implementation and artwork based on the supplied brief. Storytelling inspiration: [BIRTHDAY](https://github.com/siddardhakumaryalakala/BIRTHDAY), [interactive cake](https://smurf11k.github.io/bday-cake/), Apple's large typography and pacing. No source code or personal media from these references was copied. The additional surprise and Awwwards references were unavailable during review.

Canvas Confetti 1.9.3 is vendored locally under the ISC license (`js/canvas-confetti-LICENSE.txt`). Cormorant Garamond, Inter, and Caveat use the SIL Open Font License; copies are included. All site assets load locally. No backend, analytics, tracking, account, framework, or GSAP dependency is needed.
