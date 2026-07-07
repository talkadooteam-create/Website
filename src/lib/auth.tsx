import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from './supabase'
import { recordConsent } from './account'

const PENDING_CONSENT_KEY = 'talkadoo_pending_consent'

interface AuthState {
  session: Session | null
  user: User | null
  loading: boolean
  configured: boolean
}

interface AuthContextValue extends AuthState {
  signUp: (email: string, password: string) => Promise<{ error: string | null }>
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    session: null,
    user: null,
    loading: true,
    configured: isSupabaseConfigured,
  })

  useEffect(() => {
    if (!supabase) {
      setState((s) => ({ ...s, loading: false }))
      return
    }

    supabase.auth.getSession().then(({ data }) => {
      setState((s) => ({ ...s, session: data.session, user: data.session?.user ?? null, loading: false }))
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setState((s) => ({ ...s, session, user: session?.user ?? null, loading: false }))
      // If a signup was consented but we couldn't write it until the session existed,
      // record it now (idempotent).
      if (session && localStorage.getItem(PENDING_CONSENT_KEY)) {
        recordConsent()
          .then(() => localStorage.removeItem(PENDING_CONSENT_KEY))
          .catch(() => {})
      }
    })

    return () => sub.subscription.unsubscribe()
  }, [])

  const signUp: AuthContextValue['signUp'] = async (email, password) => {
    if (!supabase) return { error: 'Accounts aren’t connected yet.' }
    const { data, error } = await supabase.auth.signUp({ email: email.trim(), password })
    if (error) return { error: humanize(error.message) }
    // Autoconfirm is on → we have a session now: record consent immediately.
    if (data.session) {
      try {
        await recordConsent()
      } catch {
        localStorage.setItem(PENDING_CONSENT_KEY, '1')
      }
    } else {
      // Email confirmation flow (if ever enabled): record consent on first sign-in.
      localStorage.setItem(PENDING_CONSENT_KEY, '1')
    }
    return { error: null }
  }

  const signIn: AuthContextValue['signIn'] = async (email, password) => {
    if (!supabase) return { error: 'Accounts aren’t connected yet.' }
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    return { error: error ? humanize(error.message) : null }
  }

  const signOut = async () => {
    await supabase?.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ ...state, signUp, signIn, signOut }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}

function humanize(msg: string): string {
  const m = msg.toLowerCase()
  if (m.includes('already registered')) return 'That email already has an account — try logging in.'
  if (m.includes('invalid login')) return 'Email or password doesn’t match. Please try again.'
  if (m.includes('password')) return 'Password must be at least 6 characters.'
  return msg
}
