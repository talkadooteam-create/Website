# Talkadoo — "Phone as the remote" spec

A short note for whoever builds the **box/game** side. The website (parent's phone) will
drive the game's menus — pick child, pick category, pick game, settings, back, quit — while
the **mat stays for playing** (the jumping). Nothing connects phone-to-box directly; it all
goes through the shared Supabase backend, the same way pairing does.

Mental model: **TV = the screen · mat = play · phone (website) = the remote.**

---

## How it works (through Supabase Realtime)

1. Parent taps something on the website → the website **writes a command** to a `remote_sessions`
   row for their box.
2. The box is **subscribed** to that row (Supabase **Realtime**) → it sees the command instantly
   and reacts on the TV.
3. The box **writes its current screen state** back to the same row → the website reflects it
   (so the phone shows "Animals · round 3", greys out buttons, etc.).

Menu navigation isn't latency-sensitive (unlike the jumping, which stays local on the box), so
~sub-second round-trips through Supabase are fine.

---

## The one table

One row **per box**. The box owns/creates it after pairing; the phone reads it and writes the
`command` field; the box writes the `state` field.

```sql
create table if not exists remote_sessions (
  device_id    text primary key,                         -- your existing box/device id
  parent_id    uuid not null default auth.uid(),         -- owner (from pairing)
  child_id     text references children(id),             -- which child is active (nullable)
  command      jsonb,                                     -- latest phone -> box instruction (see below)
  command_seq  bigint not null default 0,                -- bumped on EVERY new command (dedupe key)
  state        jsonb,                                     -- latest box -> phone screen state (see below)
  updated_at   timestamptz not null default now()
);

alter table remote_sessions enable row level security;

-- Parent may read/write only their own box's row.
create policy remote_own on remote_sessions
  using (parent_id = auth.uid())
  with check (parent_id = auth.uid());

-- Turn on Realtime for this table.
alter publication supabase_realtime add table remote_sessions;
```

**You own the device-auth model** — if the box authenticates as something other than the parent
(a device JWT, service token, etc.), add a matching policy so the box can read/write its own row.
And wire `device_id` to whatever id your `devices`/pairing already uses.

**Dedupe:** the phone bumps `command_seq` on every tap. The box remembers the last seq it ran and
ignores anything not greater — so a command is never missed or run twice.

---

## The command language (the part we must agree on)

This is the contract. The website will send exactly these; the box needs to understand them.
**Items marked `TBD (you)` are things only you can fill from the game — please send me the real
lists and I'll match them exactly.**

### Phone → box  (`command` = `{ "seq": <n>, "type": "...", ...payload }`)

| type | payload | meaning |
|---|---|---|
| `set_child` | `{ childId }` | choose which child profile is active |
| `open_category` | `{ category }` | go to / start a category |
| `start_game` | `{ game }` | start a game mode |
| `pause` / `resume` | — | pause / resume the current game |
| `back` | — | go back one screen |
| `quit` | — | quit to home/menu |
| `open_settings` / `close_settings` | — | open / close settings |
| `set_setting` | `{ key, value }` | change a setting |
| `repeat` | — | replay the current prompt (optional) |

- **`category` values** — TBD (you). Best guess from the syllabus: `animals, food, fruits,
  household, family, body, nature, clothes, colours, numbers, letters, shapes`. Confirm the real ids.
- **`game` values** — TBD (you): the game-mode ids the box supports.
- **`set_setting` keys** — TBD (you): e.g. `volume`, `target` (language), `difficulty`.

### Box → phone  (`state` = a small snapshot the box keeps current)

```jsonc
{
  "screen":   "home",          // idle | home | category | game | playing | paused | settings | gameover
  "childId":  "c_ab12cd",
  "category": "animals",       // current, if any
  "game":     "findTheWord",   // current, if any
  "round":    3, "total": 10, "score": 20,   // during play
  "available": {               // OPTIONAL but ideal: what the box actually supports,
    "categories": ["animals","food","..."],  // so the website shows the real options
    "games": ["findTheWord","..."]           // instead of a hardcoded list
  }
}
```

If you populate `available`, the website's remote will always match what the box can do — no
hardcoded menus, nothing to keep in sync by hand.

---

## The flow, end to end

1. Box is paired to the parent's account (done — `/link`).
2. Box upserts its `remote_sessions` row and writes an initial `state` (`screen: "home"`, plus
   `available`).
3. Parent opens **Remote** on the website → reads the row, shows the current screen + options.
4. Parent taps **Animals** → website writes `command: { seq: n+1, type: "open_category",
   category: "animals" }`.
5. Box's Realtime subscription fires → it opens Animals on the TV, updates `state`.
6. Child plays on the mat (all local/fast on the box). Parent can hit **Quit / Back / Settings**
   on the phone at any time; each is one command.
7. Every answered word still goes to `learning_events` as today, so the parent's **Progress** view
   (already built on the dashboard) fills in.

---

## Who builds what

- **You (box/game):** create the table + policy + Realtime (SQL above); make the game subscribe to
  its row and act on commands; keep `state` current; send me the real `category` / `game` /
  `setting` id lists.
- **Me (website):** a **Remote** screen on the parent dashboard — friendly buttons for child,
  category, game, settings, back, quit — reading `state` and writing `command` to the row.

## Suggested phase 1 (start small)
Just **pick child → pick category → start game**, plus **quit**. That's the highest-value slice and
proves the whole loop. Add pause/back/settings/repeat right after.

## Open questions for you
1. Happy routing the remote through **Supabase Realtime** on a `remote_sessions` table, or did you
   have another mechanism in mind?
2. The real **category ids, game-mode ids, and setting keys** (so the website matches the game).
3. How the **box authenticates** after pairing, so the RLS policy lets it read/write its row.
