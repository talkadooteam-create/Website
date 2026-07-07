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
  | { ok: false; reason: 'not-connected' | 'duplicate' | 'invalid' | 'error'; message: string }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Add an email to the Talkadoo waitlist. Real Supabase insert into the existing
 * `waitlist` table (columns: id, email, created_at — we send only `email`).
 * Handles invalid email, duplicates (email is UNIQUE) and network failures.
 */
export async function joinWaitlist(email: string): Promise<WaitlistResult> {
  const clean = email.trim().toLowerCase()

  if (!EMAIL_RE.test(clean)) {
    return { ok: false, reason: 'invalid', message: 'Please enter a valid email address.' }
  }
  if (!supabase) {
    return {
      ok: false,
      reason: 'not-connected',
      message:
        'Waitlist isn’t connected yet. Add your Supabase URL + anon key to .env.local (see .env.local.example).',
    }
  }

  try {
    const { error } = await supabase.from('waitlist').insert({ email: clean })
    if (error) {
      // Postgres unique-violation → already signed up. Treat as a friendly success.
      if (error.code === '23505') {
        return { ok: false, reason: 'duplicate', message: 'You’re already on the list — see you on the mat! 🎉' }
      }
      return { ok: false, reason: 'error', message: 'Something wobbled on our end. Please try again in a moment.' }
    }
    return { ok: true }
  } catch {
    // Network/CORS failure, offline, etc.
    return { ok: false, reason: 'error', message: 'Couldn’t reach the network. Please check your connection and try again.' }
  }
}
