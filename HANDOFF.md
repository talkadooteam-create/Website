# Talkadoo website — handoff

The immersive "world" landing page for Talkadoo. Parents (mostly on phones) travel
through five regions guided by Bouncy the penguin, toward one action: **join the
waitlist**.

## Run it

```bash
npm install       # already done once
npm run dev       # http://localhost:5173
npm run build     # production build → dist/
npm run preview   # preview the production build
```

## Stack & why

- **Vite + React + TypeScript + Tailwind v4** — matches your portfolio stack.
- **GSAP + ScrollTrigger** — scroll reveals + scrubbed parallax (mobile-safe).
- **@supabase/supabase-js** — the waitlist backend.
- Lightweight on purpose: no WebGL/3D. Later regions lazy-load so the hero paints
  fast on 4G. On-screen-only sprite animation keeps idle CPU near zero on phones.

## The world (in `src/sections/`)

Shore (hero) → Meadow (how it works + tappable vocab) → Forest (why parents love it)
→ Language Peaks (4 languages) → Summit (waitlist + celebration) → Where we are
(traction timeline) → Founders + contact → footer.

- **Bouncy** (`src/components/Bouncy.tsx`) — reusable sprite-sheet component; states:
  idle, walk, run, jump, turn, wave, point, cheer, clap, dance, see, sad. Decorative
  (aria-hidden), respects reduced-motion (shows a single calm frame).
- **Vocab creatures** (`src/components/VocabCreature.tsx`) — real focusable buttons;
  tap/Enter/Space → hop + speech bubble with the word **and its article**, pulled
  from Talkadoo's own syllabus data (`src/data/vocab.ts`).
- Confetti on waitlist success; balloons/bunting at the Summit.

Accessibility: semantic landmarks + headings behind the visuals, skip link, visible
focus, keyboard-reachable everything, full reduced-motion fallback.
SEO: real HTML text + JSON-LD (Organization + Product + FAQPage) in `index.html`.

---

## ⚠️ Before you ship — things I stubbed or need from you

1. **Waitlist backend (Supabase).** Create your EU project, run
   [`supabase/waitlist.sql`](supabase/waitlist.sql) in its SQL editor, then put the
   project URL + anon key into `.env.local` (see `.env.example`) and restart dev.
   Until then the form is fully working but honestly reports "not connected yet" —
   it never fakes success. The insert code is real (`src/lib/supabase.ts`).

2. **Founder photos.** Drop `founder-maira.jpg` and `founder-ali.jpg` into
   `public/`. Right now each shows an obvious dashed "Add photo" slot. (You still
   need to source a photo of Ali.)

3. **LinkedIn URLs.** Both are placeholders showing a dashed "LinkedIn URL — to
   add" chip. Set the `linkedin` fields in `src/sections/Founders.tsx`.

4. **Founder bios are DRAFTS.** Each card shows a "Draft bio — Maira to approve"
   badge. These are the drafts from your brief, in your words — review/edit them in
   `src/sections/Founders.tsx`, then delete the badge `<span>` once approved.
   **Nothing here should ship unapproved.**

5. **"mouse" → "duck".** Your brief listed a mouse in the meadow, but Talkadoo has
   no mouse art or word data yet, so I seeded **duck** instead (real art + real
   words). Swap it back in `src/data/vocab.ts` once mouse exists in the game data.

6. **Real domain.** `index.html` uses `https://talkadoo.example/` in the canonical
   link and JSON-LD `@id`s. Replace with your real domain before launch, then
   re-validate the structured data in Google's Rich Results Test.

7. **21st.dev Magic MCP.** Installed to `.mcp.json` with your API key. It activates
   the next time you open Claude Code **in this folder** (needs a restart). The file
   is git-ignored because it holds the key.

8. **Fonts** load from Google Fonts (Fredoka + Nunito) with a system-font fallback.
   Fine online; self-host later if you want zero external requests.

9. **Real-phone QA.** I verified the build, rendering, mobile layout (no horizontal
   scroll), computed styling and the no-fake-success form in a desktop preview, but
   a pixel screenshot wouldn't capture from this environment. Please do a quick pass
   on a real mid-range Android before launch.

## Note on "existing landing page" copy

There wasn't a separate marketing landing page in the repo — the game's `index.html`
only held UI strings ("Move.. Play.. and Learn"). So the copy here comes from your
brief, Bouncy's tagline ("Let's move, learn and have fun!"), and that game subtitle.

## Assets

Bouncy sprites, animal art (dog/cat/bird/horse/frog/cow/fish/duck) and flags were
copied from `Talkadoo-data-main` into `public/assets/`. If you have storybook
background illustrations, they'd elevate the regions — tell me and I'll wire slots.

---

## Parent accounts & child setup (connected to your real Supabase)

Routes (client-side, `react-router-dom`): `/login`, `/dashboard` (parent-only),
`/link`. Deep links work on static hosts via `vercel.json` + `public/_redirects`.

- **Auth** (`src/lib/auth.tsx`): email + password via Supabase Auth. Your project has
  email auto-confirm ON, so signup lands straight on the dashboard.
- **Consent** (`src/lib/account.ts` → `recordConsent`): sign-up shows a non-pre-ticked
  GDPR checkbox; on consent we insert a row into `consents` (`version` =
  `CONSENT_VERSION`). Bump that constant if you change the wording.
- **Child profiles** (`Dashboard` + `ChildForm`): create / edit / delete, stored in
  `children`. Fields collected: `nickname`, `age_band` (`4-5`/`5-6`/`6-7`), `target`
  (learning language), `avatar` (emoji). `parent_id` is filled by the DB default
  (`auth.uid()`); `children.id` is app-generated client-side (the table has no default).
- **Progress** (`ProgressPanel`): reads `learning_events`, takes each word's latest
  `word_state`, groups words by `category` into New / Learning / Learned.

### Verified against your live database
Signup → the `handle_new_parent` trigger auto-creates the `parents` row → consent
insert (201) → child create (201, `parent_id` auto) → read back (RLS-scoped) →
delete (204). UI flow tested too. **All required columns already existed — nothing
was invented, nothing is missing.** Two notes:
- The **learning language is stored in `target`**. The table also has `l1` (the
  child's home/first language), which I deliberately left null to keep data minimal.
  Want a "home language" dropdown too? Say so and I'll add it.
- `research_events` is (correctly) not readable by the anon/parent role — not needed here.

### ⚠️ One cleanup for you
Testing created a Supabase **Auth user `talkadooqa+137@gmail.com`** (I deleted its test
child, but the auth user + its `parents`/`consents` rows can only be removed with the
service role). Delete that user in **Supabase → Authentication → Users**; it cascades
and removes the leftover rows.

## Stubs wired to activate later (one-line changes)

- **Games** (`src/lib/games.ts` → `getGames()`): returns `[]` today → the dashboard
  shows "Games coming soon". Point `getGames()` at a future `games` table and the UI
  lights up unchanged. A code comment marks exactly where the per-game `published`
  flag + per-user admin check will go (not built yet, per your instruction).
- **Device linking** (`src/lib/devices.ts` → `linkDevice()`): `/link` collects a code
  (typed, or pre-filled from `?code=XXXX` for future QR), and calls `linkDevice()`,
  which currently returns a friendly "coming soon" and writes nothing. Implement just
  that one function later to go live; the page UI needs no changes.
