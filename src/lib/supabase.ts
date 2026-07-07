import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/** True once real Supabase credentials are present in .env.local. */
export const isSupabaseConfigured = Boolean(url && anonKey)

/** Shared browser client (null until credentials are set). Persists the parent session. */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url!, anonKey!, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
  : null

// Kept for the existing waitlist form.
export const isWaitlistConnected = isSupabaseConfigured

export type WaitlistResult =
  | { ok: true }
  | { ok: false; reason: 'not-connected' | 'duplicate' | 'error'; message: string }

/**
 * Add an email to the Talkadoo waitlist. Real Supabase insert — no front-end stub.
 * When credentials are absent it returns `not-connected` so the UI tells the truth.
 */
export async function joinWaitlist(email: string, locale?: string): Promise<WaitlistResult> {
  if (!supabase) {
    return {
      ok: false,
      reason: 'not-connected',
      message:
        'Waitlist isn’t connected yet. Add your Supabase URL + anon key to .env.local (see .env.example).',
    }
  }

  const { error } = await supabase
    .from('waitlist')
    .insert({ email: email.trim().toLowerCase(), locale: locale ?? null, source: 'website' })

  if (error) {
    if (error.code === '23505') {
      return { ok: false, reason: 'duplicate', message: 'You’re already on the list — see you on the mat!' }
    }
    return { ok: false, reason: 'error', message: 'Something wobbled. Please try again in a moment.' }
  }

  return { ok: true }
}
