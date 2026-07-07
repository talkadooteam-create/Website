// ─────────────────────────────────────────────────────────
// Games data source — STUB for now (no `games` table exists in Supabase yet).
//
// To go live later, this is the ONLY place to change: point `getGames()` at the
// real Supabase `games` table. The rest of the UI (GamesSection) consumes this
// function and needs no edits.
// ─────────────────────────────────────────────────────────

export interface Game {
  id: string
  title: string
  description: string
  emoji: string
  // FUTURE: `published` flag lives here once the games table exists. The query in
  // getGames() will filter `.eq('published', true)` for everyone EXCEPT admins —
  // and the per-user admin check (e.g. an `is_admin` flag on the parent / a role
  // claim on the session) will be read here to decide whether to include
  // unpublished games. Do NOT implement that logic yet.
  // published?: boolean
}

/**
 * Returns the list of playable games. Currently empty (nothing published yet), which
 * makes GamesSection show its "coming soon" state.
 *
 * LATER — swap the body for something like:
 *   const { data } = await supabase.from('games').select('*')
 *     .eq('published', true)          // …unless the current user is an admin
 *   return data ?? []
 * and this is the only function that changes.
 */
export async function getGames(): Promise<Game[]> {
  return []
}
