import { useState } from 'react'
import { AGE_BANDS, TARGET_LANGUAGES, type AgeBand, type Child, type ChildInput } from '../../lib/account'
import type { Lang } from '../../data/vocab'

const AVATARS = ['🐧', '🦊', '🐻', '🐰', '🐸', '🦉', '🐝', '🐨', '🦁', '🐯']

const field: React.CSSProperties = {
  width: '100%',
  padding: '0.7rem 0.9rem',
  borderRadius: 12,
  border: '2px solid #2b2b3322',
  fontSize: '1rem',
  fontFamily: 'var(--font-body)',
  background: '#fff',
}

/** Create or edit a child profile. Kept deliberately tiny (data minimisation). */
export default function ChildForm({
  initial,
  onSubmit,
  onCancel,
  busy,
}: {
  initial?: Child
  onSubmit: (input: ChildInput) => void
  onCancel: () => void
  busy?: boolean
}) {
  const [nickname, setNickname] = useState(initial?.nickname ?? '')
  const [ageBand, setAgeBand] = useState<AgeBand>((initial?.age_band as AgeBand) ?? '4-5')
  const [target, setTarget] = useState<Lang>((initial?.target as Lang) ?? 'de')
  const [avatar, setAvatar] = useState(initial?.avatar ?? '🐧')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!nickname.trim()) return
    onSubmit({ nickname: nickname.trim(), age_band: ageBand, target, avatar })
  }

  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: '1rem' }}>
      <div>
        <label style={{ fontWeight: 700, fontSize: '0.85rem' }} htmlFor="cf-nick">
          First name or nickname
        </label>
        <input
          id="cf-nick"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          maxLength={40}
          required
          placeholder="e.g. Mia"
          style={{ ...field, marginTop: '0.3rem' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
        <div>
          <label style={{ fontWeight: 700, fontSize: '0.85rem' }} htmlFor="cf-age">
            Age band
          </label>
          <select
            id="cf-age"
            value={ageBand}
            onChange={(e) => setAgeBand(e.target.value as AgeBand)}
            style={{ ...field, marginTop: '0.3rem' }}
          >
            {AGE_BANDS.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ fontWeight: 700, fontSize: '0.85rem' }} htmlFor="cf-lang">
            Learning
          </label>
          <select
            id="cf-lang"
            value={target}
            onChange={(e) => setTarget(e.target.value as Lang)}
            style={{ ...field, marginTop: '0.3rem' }}
          >
            {TARGET_LANGUAGES.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Avatar</span>
        <div role="radiogroup" aria-label="Pick an avatar" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.4rem' }}>
          {AVATARS.map((a) => (
            <button
              key={a}
              type="button"
              role="radio"
              aria-checked={avatar === a}
              aria-label={`Avatar ${a}`}
              onClick={() => setAvatar(a)}
              style={{
                fontSize: '1.4rem',
                width: 44,
                height: 44,
                borderRadius: 12,
                cursor: 'pointer',
                border: avatar === a ? '2.5px solid var(--color-purple)' : '2px solid #2b2b3318',
                background: avatar === a ? '#f2ecfb' : '#fff',
              }}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.3rem' }}>
        <button
          type="submit"
          disabled={busy}
          style={{
            flex: 1,
            padding: '0.8rem',
            borderRadius: 12,
            border: 'none',
            background: 'var(--color-purple)',
            color: '#fff',
            fontWeight: 800,
            fontFamily: 'var(--font-display)',
            cursor: 'pointer',
            opacity: busy ? 0.7 : 1,
          }}
        >
          {busy ? 'Saving…' : initial ? 'Save changes' : 'Add child'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: '0.8rem 1.1rem',
            borderRadius: 12,
            border: '2px solid #2b2b3322',
            background: '#fff',
            fontWeight: 700,
            fontFamily: 'var(--font-body)',
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
