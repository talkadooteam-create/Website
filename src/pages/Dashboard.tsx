import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AccountShell from '../components/account/AccountShell'
import ChildForm from '../components/account/ChildForm'
import ProgressPanel from '../components/account/ProgressPanel'
import GamesSection from '../components/account/GamesSection'
import {
  AGE_BANDS,
  TARGET_LANGUAGES,
  createChild,
  deleteChild,
  listChildren,
  updateChild,
  type Child,
  type ChildInput,
} from '../lib/account'

const ageLabel = (v: string | null) => AGE_BANDS.find((a) => a.value === v)?.label ?? '—'
const langLabel = (v: string | null) => TARGET_LANGUAGES.find((l) => l.value === v)?.label ?? '—'

export default function Dashboard() {
  const [children, setChildren] = useState<Child[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [openProgress, setOpenProgress] = useState<Record<string, boolean>>({})
  const [busy, setBusy] = useState(false)

  async function refresh() {
    try {
      setChildren(await listChildren())
      setStatus('ready')
    } catch {
      setStatus('error')
    }
  }
  useEffect(() => {
    refresh()
  }, [])

  async function handleAdd(input: ChildInput) {
    setBusy(true)
    try {
      await createChild(input)
      setAdding(false)
      await refresh()
    } finally {
      setBusy(false)
    }
  }

  async function handleEdit(id: string, input: ChildInput) {
    setBusy(true)
    try {
      await updateChild(id, input)
      setEditingId(null)
      await refresh()
    } finally {
      setBusy(false)
    }
  }

  async function handleDelete(c: Child) {
    if (!window.confirm(`Delete ${c.nickname || 'this profile'}? This removes their learning data too.`)) return
    await deleteChild(c.id)
    await refresh()
  }

  return (
    <AccountShell>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.3rem' }}>Your dashboard</h1>
      <p style={{ opacity: 0.75, marginBottom: '2rem' }}>Manage your children’s profiles and follow their progress.</p>

      {/* Children */}
      <section aria-labelledby="children-heading" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 id="children-heading" style={{ fontSize: '1.35rem' }}>
            Children
          </h2>
          {!adding && (
            <button
              type="button"
              onClick={() => {
                setAdding(true)
                setEditingId(null)
              }}
              style={{
                background: 'var(--color-purple)',
                color: '#fff',
                border: 'none',
                borderRadius: 999,
                padding: '0.55rem 1.1rem',
                fontWeight: 800,
                fontFamily: 'var(--font-display)',
                cursor: 'pointer',
              }}
            >
              + Add child
            </button>
          )}
        </div>

        {status === 'loading' && <p style={{ opacity: 0.6 }}>Loading…</p>}
        {status === 'error' && (
          <p style={{ color: '#b23a48', fontWeight: 700 }}>Couldn’t load your children. Please refresh.</p>
        )}

        {adding && (
          <div style={{ background: '#fff', borderRadius: 20, padding: '1.4rem', boxShadow: 'var(--shadow-soft)', marginBottom: '1rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>New child profile</h3>
            <ChildForm onSubmit={handleAdd} onCancel={() => setAdding(false)} busy={busy} />
          </div>
        )}

        {status === 'ready' && children.length === 0 && !adding && (
          <div style={{ background: '#fff', borderRadius: 20, padding: '2rem', textAlign: 'center', boxShadow: 'var(--shadow-soft)' }}>
            <div style={{ fontSize: '2.4rem' }}>🐣</div>
            <p style={{ fontWeight: 700, fontFamily: 'var(--font-display)', margin: '0.5rem 0 0.2rem' }}>No profiles yet</p>
            <p style={{ opacity: 0.7, margin: 0 }}>Add your first child to get them ready for the mat.</p>
          </div>
        )}

        <div style={{ display: 'grid', gap: '1rem' }}>
          {children.map((c) => (
            <div key={c.id} style={{ background: '#fff', borderRadius: 20, padding: '1.3rem', boxShadow: 'var(--shadow-soft)' }}>
              {editingId === c.id ? (
                <>
                  <h3 style={{ marginBottom: '1rem' }}>Edit profile</h3>
                  <ChildForm initial={c} onSubmit={(input) => handleEdit(c.id, input)} onCancel={() => setEditingId(null)} busy={busy} />
                </>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <span aria-hidden="true" style={{ fontSize: '2.2rem', lineHeight: 1 }}>
                      {c.avatar || '🐧'}
                    </span>
                    <div style={{ flex: 1, minWidth: 140 }}>
                      <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{c.nickname || 'Little one'}</h3>
                      <p style={{ margin: '0.15rem 0 0', opacity: 0.7, fontSize: '0.9rem' }}>
                        {ageLabel(c.age_band)} · Learning {langLabel(c.target)}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        type="button"
                        onClick={() => setOpenProgress((p) => ({ ...p, [c.id]: !p[c.id] }))}
                        aria-expanded={!!openProgress[c.id]}
                        style={pillBtn}
                      >
                        {openProgress[c.id] ? 'Hide progress' : 'Progress'}
                      </button>
                      <button type="button" onClick={() => { setEditingId(c.id); setAdding(false) }} style={pillBtn}>
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(c)}
                        style={{ ...pillBtn, color: '#b23a48', borderColor: '#b23a4833' }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {openProgress[c.id] && (
                    <div style={{ marginTop: '1.1rem', paddingTop: '1.1rem', borderTop: '1px solid #2b2b3312' }}>
                      <ProgressPanel childId={c.id} />
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Games (stub) */}
      <div style={{ marginBottom: '2rem' }}>
        <GamesSection />
      </div>

      {/* Device linking entry */}
      <section
        style={{
          background: 'linear-gradient(180deg, #f2ecfb, #eee7f7)',
          borderRadius: 20,
          padding: 'clamp(1.3rem, 4vw, 1.8rem)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <span aria-hidden="true" style={{ fontSize: '2rem' }}>📺</span>
        <div style={{ flex: 1, minWidth: 180 }}>
          <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Connect your Talkadoo mat</h2>
          <p style={{ margin: '0.2rem 0 0', opacity: 0.8, fontSize: '0.9rem' }}>
            When your mat arrives, link it to your account with the code on your TV.
          </p>
        </div>
        <Link
          to="/link"
          style={{
            background: 'var(--color-purple)',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: 999,
            padding: '0.6rem 1.2rem',
            fontWeight: 800,
            fontFamily: 'var(--font-display)',
          }}
        >
          Link a device
        </Link>
      </section>
    </AccountShell>
  )
}

const pillBtn: React.CSSProperties = {
  border: '2px solid #2b2b3322',
  background: '#fff',
  borderRadius: 999,
  padding: '0.4rem 0.85rem',
  fontWeight: 700,
  fontFamily: 'var(--font-body)',
  fontSize: '0.82rem',
  cursor: 'pointer',
}
