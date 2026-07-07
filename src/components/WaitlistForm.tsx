import { useId, useState } from 'react'
import { joinWaitlist } from '../lib/supabase'

type Status = 'idle' | 'saving' | 'done' | 'dupe' | 'unconnected' | 'error'

interface Props {
  variant?: 'hero' | 'full'
  onSuccess?: () => void
}

/**
 * The waitlist form: a plain semantic form that inserts { email } into Supabase.
 * Works with the keyboard, announces status via aria-live, and handles invalid
 * emails, duplicates and network failures with friendly messages.
 */
export default function WaitlistForm({ variant = 'full', onSuccess }: Props) {
  const id = useId()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')

  const done = status === 'done' || status === 'dupe'
  const isRow = variant === 'hero'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (status === 'saving' || done) return
    setStatus('saving')
    const res = await joinWaitlist(email)
    if (res.ok) {
      setStatus('done')
      setMessage('You’re on the mat! We’ll be in touch before launch. 🎉')
      onSuccess?.()
    } else if (res.reason === 'duplicate') {
      setStatus('dupe')
      setMessage(res.message)
      onSuccess?.()
    } else if (res.reason === 'not-connected') {
      setStatus('unconnected')
      setMessage(res.message)
    } else {
      // invalid email or network/server error
      setStatus('error')
      setMessage(res.message)
    }
  }

  if (done) {
    return (
      <div
        role="status"
        aria-live="polite"
        style={{
          background: '#fff',
          border: '3px solid var(--color-gold)',
          borderRadius: 20,
          padding: '1.25rem 1.5rem',
          boxShadow: 'var(--shadow-soft)',
          fontWeight: 700,
          maxWidth: 460,
        }}
      >
        <span style={{ fontSize: '1.15rem' }}>{message}</span>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      style={{
        display: 'flex',
        flexDirection: isRow ? 'row' : 'column',
        flexWrap: 'wrap',
        gap: '0.6rem',
        maxWidth: isRow ? 520 : 440,
        width: '100%',
      }}
    >
      <label htmlFor={id} className="sr-only">
        Your email address
      </label>
      <input
        id={id}
        type="email"
        name="email"
        inputMode="email"
        autoComplete="email"
        required
        placeholder="you@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          // In the row (hero) layout the input grows to fill; in the column (full)
          // layout it must NOT flex-grow, or flex-basis becomes its height → a giant
          // pill/circle. Keep it a normal-height pill in both.
          flex: isRow ? '1 1 220px' : '0 0 auto',
          width: isRow ? undefined : '100%',
          minWidth: 0,
          padding: '0.9rem 1.1rem',
          borderRadius: 999,
          border: '2.5px solid var(--color-ink)',
          fontSize: '1.05rem',
          fontFamily: 'var(--font-body)',
          background: '#fff',
        }}
      />
      <button
        type="submit"
        disabled={status === 'saving'}
        className="squish"
        style={{
          flex: '0 0 auto',
          width: isRow ? undefined : '100%',
          padding: '0.9rem 1.6rem',
          borderRadius: 999,
          border: 'none',
          background: 'var(--color-purple)',
          color: '#fff',
          fontWeight: 800,
          fontSize: '1.05rem',
          fontFamily: 'var(--font-display)',
          cursor: 'pointer',
          boxShadow: 'var(--shadow-pop)',
          opacity: status === 'saving' ? 0.7 : 1,
        }}
      >
        {status === 'saving' ? 'Jumping in…' : 'Join the waitlist'}
      </button>

      <p style={{ flexBasis: '100%', fontSize: '0.85rem', opacity: 0.75, margin: '0.1rem 0 0' }}>
        Free to join · EU launch first · No spam, ever.
      </p>

      <div role="status" aria-live="polite" style={{ flexBasis: '100%', minHeight: 4 }}>
        {status === 'error' && <p style={{ color: '#b23a48', fontWeight: 700, margin: 0 }}>{message}</p>}
        {status === 'unconnected' && (
          <p
            style={{
              color: 'var(--color-ink)',
              background: '#fff4d6',
              border: '2px dashed var(--color-orange)',
              borderRadius: 12,
              padding: '0.5rem 0.75rem',
              fontSize: '0.85rem',
              margin: '0.3rem 0 0',
            }}
          >
            {message}
          </p>
        )}
      </div>
    </form>
  )
}
