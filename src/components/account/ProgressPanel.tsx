import { useEffect, useState } from 'react'
import { getChildProgress, type ChildProgress } from '../../lib/account'

const STATE_META = [
  { key: 'new', label: 'New', color: '#8a8594', bg: '#efece6' },
  { key: 'learning', label: 'Learning', color: '#E8912B', bg: '#fdf0dc' },
  { key: 'learned', label: 'Learned', color: '#4a9e5f', bg: '#e3f2e6' },
] as const

/** Reads a child's learning_events and shows words by state, grouped by category. */
export default function ProgressPanel({ childId }: { childId: string }) {
  const [data, setData] = useState<ChildProgress | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    let alive = true
    setStatus('loading')
    getChildProgress(childId)
      .then((d) => {
        if (alive) {
          setData(d)
          setStatus('ready')
        }
      })
      .catch(() => alive && setStatus('error'))
    return () => {
      alive = false
    }
  }, [childId])

  if (status === 'loading') return <p style={{ opacity: 0.6, fontSize: '0.9rem', margin: 0 }}>Loading progress…</p>
  if (status === 'error')
    return <p style={{ color: '#b23a48', fontSize: '0.9rem', margin: 0 }}>Couldn’t load progress. Please try again.</p>

  const totals = data!.totals
  const empty = totals.new + totals.learning + totals.learned === 0

  if (empty) {
    return (
      <p style={{ opacity: 0.7, fontSize: '0.9rem', margin: 0, background: '#faf6ee', borderRadius: 12, padding: '0.9rem' }}>
        No words yet — once your child starts playing on the mat, the words they meet will appear here as{' '}
        <strong>New</strong>, <strong>Learning</strong> and <strong>Learned</strong>.
      </p>
    )
  }

  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      {/* totals */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {STATE_META.map((s) => (
          <span
            key={s.key}
            style={{ background: s.bg, color: s.color, borderRadius: 999, padding: '0.3rem 0.8rem', fontWeight: 700, fontSize: '0.85rem' }}
          >
            {totals[s.key]} {s.label}
          </span>
        ))}
      </div>

      {/* per category */}
      {data!.categories.map((cat) => (
        <div key={cat.category} style={{ borderTop: '1px solid #2b2b3312', paddingTop: '0.7rem' }}>
          <h4 style={{ margin: '0 0 0.5rem', fontFamily: 'var(--font-display)', textTransform: 'capitalize' }}>
            {cat.category}
          </h4>
          <div style={{ display: 'grid', gap: '0.4rem' }}>
            {STATE_META.map((s) => {
              const words = cat[s.key]
              if (!words.length) return null
              return (
                <div key={s.key} style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: s.color, minWidth: 62 }}>{s.label}</span>
                  {words.map((w) => (
                    <span
                      key={w}
                      style={{ background: s.bg, color: s.color, borderRadius: 8, padding: '0.15rem 0.55rem', fontSize: '0.85rem', fontWeight: 600 }}
                    >
                      {w}
                    </span>
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
