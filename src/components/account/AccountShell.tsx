import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../lib/auth'

/**
 * Calm, parent-facing chrome for the account area: a quiet header with the
 * wordmark and (when signed in) a sign-out control, over a soft cream page.
 */
export default function AccountShell({
  children,
  maxWidth = 860,
}: {
  children: ReactNode
  maxWidth?: number
}) {
  const { user, signOut } = useAuth()

  return (
    <div style={{ minHeight: '100svh', background: 'linear-gradient(180deg, #faf5ea, #f5efe0)' }}>
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem clamp(1rem, 4vw, 2rem)',
          borderBottom: '1px solid #2b2b3312',
          background: '#fffdf8',
        }}
      >
        <Link
          to="/"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '1.35rem',
            color: 'var(--color-purple)',
            textDecoration: 'none',
          }}
        >
          Talkadoo
        </Link>
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
            <span style={{ fontSize: '0.85rem', opacity: 0.6, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.email}
            </span>
            <button
              type="button"
              onClick={() => signOut()}
              style={{
                border: '2px solid #2b2b3322',
                background: '#fff',
                borderRadius: 999,
                padding: '0.4rem 0.9rem',
                fontWeight: 700,
                fontFamily: 'var(--font-body)',
                cursor: 'pointer',
                fontSize: '0.85rem',
              }}
            >
              Sign out
            </button>
          </div>
        )}
      </header>

      <main style={{ maxWidth, margin: '0 auto', padding: 'clamp(1.5rem, 5vw, 3rem) clamp(1rem, 4vw, 2rem) 4rem' }}>
        {children}
      </main>
    </div>
  )
}
