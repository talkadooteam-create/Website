// ─────────────────────────────────────────────────────────
// Device linking — STUB for now (no `devices` table exists in Supabase yet).
//
// The /link page collects a code (typed, or pre-filled from ?code=XXXX for future
// QR scanning) and calls linkDevice(). Today it returns a friendly "coming soon"
// result and writes nothing. To go live later, implement ONLY this function:
// find the device row for `code` and attach it to the signed-in parent's account.
// The page UI needs no changes.
// ─────────────────────────────────────────────────────────

export type LinkResult =
  | { ok: true }
  | { ok: false; reason: 'coming-soon' | 'invalid' | 'error'; message: string }

/**
 * LATER — replace the stub body with the real link, e.g.:
 *   const { data, error } = await supabase
 *     .from('devices')
 *     .update({ parent_id: (await supabase.auth.getUser()).data.user!.id })
 *     .eq('link_code', code.trim().toUpperCase())
 *     .is('parent_id', null)
 *     .select()
 *     .single()
 *   if (error || !data) return { ok: false, reason: 'invalid', message: '…' }
 *   return { ok: true }
 */
export async function linkDevice(_code: string): Promise<LinkResult> {
  return {
    ok: false,
    reason: 'coming-soon',
    message:
      'Device linking is coming soon. Once your Talkadoo mat ships, you’ll enter the code shown on your TV here to connect it to your account.',
  }
}
