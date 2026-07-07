import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import AccountShell from '../components/account/AccountShell'
import { useAuth } from '../lib/auth'
import { CONSENT_TEXT } from '../lib/account'

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.8rem 1rem',
  borderRadius: 14,
  border: '2px solid #2b2b3322',
  fontSize: '1rem',
  fontFamily: 'var(--font-body)',
  background: '#fff',
}

export default function Login() {
  const { user, loading, configured, signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [consent, setConsent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!loading && user) return <Navigate to="/dashboard" replace />

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (mode === 'signup' && !consent) {
      setError('Please tick the consent box to create an account for your child.')
      return
    }
    setBusy(true)
    const { error } =
      mode === 'signup' ? await signUp(email, password) : await signIn(email, password)
    setBusy(false)
    if (error) {
      setError(error)
      return
    }
    navigate('/dashboard', { replace: true })
  }

  return (
    <AccountShell maxWidth={480}>
      {!configured && (
        <div
          style={{
            background: '#fff4d6',
            border: '2px dashed var(--color-orange)',
            borderRadius: 16,
            padding: '1rem',
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
          }}
        >
          Accounts aren’t connected yet — add your Supabase keys to <code>.env.local</code>.
        </div>
      )}

      <div style={{ background: '#fff', borderRadius: 24, padding: 'clamp(1.5rem, 5vw, 2.4rem)', boxShadow: 'var(--shadow-soft)' }}>
        <h1 style={{ fontSize: '1.9rem', marginBottom: '0.4rem' }}>
          {mode === 'login' ? 'Welcome back' : 'Create your parent account'}
        </h1>
        <p style={{ opacity: 0.75, marginBottom: '1.5rem' }}>
          {mode === 'login'
            ? 'Log in to manage your children’s profiles and see their progress.'
            : 'One account for you, gentle profiles for your little ones.'}
        </p>

        {/* mode switch */}
        <div role="tablist" aria-label="Login or sign up" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {(['login', 'signup'] as const).map((m) => (
            <button
              key={m}
              role="tab"
              aria-selected={mode === m}
              type="button"
              onClick={() => {
                setMode(m)
                setError(null)
              }}
              style={{
                flex: 1,
                padding: '0.55rem',
                borderRadius: 12,
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700,
                fontFamily: 'var(--font-display)',
                background: mode === m ? 'var(--color-purple)' : '#f0ebe0',
                color: mode === m ? '#fff' : 'var(--color-ink)',
              }}
            >
              {m === 'login' ? 'Log in' : 'Sign up'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          <label style={{ fontWeight: 700, fontSize: '0.9rem' }}>
            Email
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ ...inputStyle, marginTop: '0.35rem' }}
            />
          </label>
          <label style={{ fontWeight: 700, fontSize: '0.9rem' }}>
            Password
            <input
              type="password"
              required
              minLength={6}
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ ...inputStyle, marginTop: '0.35rem' }}
            />
            {mode === 'signup' && (
              <span style={{ fontWeight: 400, fontSize: '0.78rem', opacity: 0.6 }}>At least 6 characters.</span>
            )}
          </label>

          {mode === 'signup' && (
            <label
              style={{
                display: 'flex',
                gap: '0.7rem',
                alignItems: 'flex-start',
                background: '#f7f3ea',
                border: '2px solid #2b2b3315',
                borderRadius: 14,
                padding: '0.9rem',
                fontSize: '0.85rem',
                lineHeight: 1.5,
              }}
            >
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                style={{ marginTop: 3, width: 20, height: 20, flex: '0 0 auto', accentColor: 'var(--color-purple)' }}
              />
              <span>{CONSENT_TEXT}</span>
            </label>
          )}

          {error && (
            <p role="alert" style={{ color: '#b23a48', fontWeight: 700, margin: 0, fontSize: '0.9rem' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy || !configured}
            style={{
              padding: '0.9rem',
              borderRadius: 14,
              border: 'none',
              background: 'var(--color-purple)',
              color: '#fff',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              fontSize: '1.05rem',
              cursor: busy ? 'wait' : 'pointer',
              opacity: busy || !configured ? 0.7 : 1,
              boxShadow: 'var(--shadow-pop)',
            }}
          >
            {busy ? 'One moment…' : mode === 'login' ? 'Log in' : 'Create account'}
          </button>
        </form>
      </div>

      <p style={{ textAlign: 'center', marginTop: '1.2rem', fontSize: '0.8rem', opacity: 0.6 }}>
        GDPR-minimal: we store only what’s needed for your child’s learning. You can delete profiles anytime.
      </p>
    </AccountShell>
  )
}
