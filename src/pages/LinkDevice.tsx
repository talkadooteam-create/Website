import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import AccountShell from '../components/account/AccountShell'
import { linkDevice, type LinkResult } from '../lib/devices'

/**
 * /link — device pairing. Reads a pre-filled code from ?code=XXXX (for future QR
 * scanning) or lets the parent type the code shown on their TV. Today it calls the
 * linkDevice() stub, which returns a friendly "coming soon" state and writes nothing.
 */
export default function LinkDevice() {
  const [params] = useSearchParams()
  const [code, setCode] = useState(params.get('code') ?? '')
  const [result, setResult] = useState<LinkResult | null>(null)
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setResult(await linkDevice(code))
    setBusy(false)
  }

  return (
    <AccountShell maxWidth={460}>
      <div style={{ background: '#fff', borderRadius: 24, padding: 'clamp(1.5rem, 5vw, 2.4rem)', boxShadow: 'var(--shadow-soft)', textAlign: 'center' }}>
        <div aria-hidden="true" style={{ fontSize: '2.6rem' }}>📺</div>
        <h1 style={{ fontSize: '1.7rem', margin: '0.4rem 0 0.4rem' }}>Link your Talkadoo mat</h1>
        <p style={{ opacity: 0.75, marginBottom: '1.5rem' }}>
          Enter the code shown on your TV to connect your mat to this account.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.9rem' }}>
          <label htmlFor="link-code" className="sr-only">
            Device code
          </label>
          <input
            id="link-code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="e.g. 4B7K"
            autoComplete="one-time-code"
            style={{
              width: '100%',
              padding: '0.9rem',
              borderRadius: 14,
              border: '2px solid #2b2b3322',
              fontSize: '1.4rem',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              textAlign: 'center',
              letterSpacing: '0.3em',
              background: '#fff',
            }}
          />
          <button
            type="submit"
            disabled={busy || !code.trim()}
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
              opacity: busy || !code.trim() ? 0.7 : 1,
            }}
          >
            {busy ? 'Linking…' : 'Link device'}
          </button>
        </form>

        {result && !result.ok && (
          <div
            role="status"
            style={{
              marginTop: '1.3rem',
              background: '#fff4d6',
              border: '2px dashed var(--color-orange)',
              borderRadius: 16,
              padding: '1rem',
              fontSize: '0.9rem',
              lineHeight: 1.5,
            }}
          >
            <strong>{result.reason === 'coming-soon' ? '🚧 Coming soon' : 'Hmm'}</strong>
            <p style={{ margin: '0.3rem 0 0' }}>{result.message}</p>
          </div>
        )}
      </div>
    </AccountShell>
  )
}
