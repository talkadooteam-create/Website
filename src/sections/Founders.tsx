import { useState } from 'react'
import Bouncy from '../components/Bouncy'
import { useReveal } from '../hooks/useReveal'

interface Founder {
  name: string
  role: string
  photo: string
  initials: string
  tint: string
  linkedin: string | null // null → not provided yet
  bio: string
}

const FOUNDERS: Founder[] = [
  {
    name: 'Maira Haecker',
    role: 'Co-founder · pedagogy, product & design',
    photo: './founder-maira.jpg',
    initials: 'MH',
    tint: 'var(--color-purple)',
    linkedin: 'https://www.linkedin.com/in/mairahaecker1502',
    bio: 'Maira grew up with a single mother determined to raise her across five languages — and saw first-hand how much work that took, for parent and child alike. Later, as an international student, she kept meeting the same struggle everywhere: learning a language the hard way, at a desk. She became convinced kids learn best the way they play — moving, laughing, exploring — not sitting still in front of a screen. The idea for Talkadoo began during her bachelor studies with friends, and she went on to pursue it full-time during her entrepreneurship master’s.',
  },
  {
    name: 'Ahmed Magdy Ali (“Ali”)',
    role: 'Co-founder · technology & engineering · based in Sweden',
    photo: './founder-ali.jpg',
    initials: 'AA',
    tint: 'var(--color-orange)',
    linkedin: 'https://www.linkedin.com/in/ali-a-a9812595/',
    bio: 'Ali joined Maira in the entrepreneurship master’s program, where the two started working together — and it clicked immediately. He speaks many languages and has taught them to others, so he understands first-hand the struggle Talkadoo is built to solve. He fell for the idea and its potential, fully committed, and today drives the project forward — leading the technology and building the game alongside Maira.',
  },
]

/**
 * Founder portrait. Shows the photo once one is added to /public; until then a
 * clean, on-brand initials avatar (intentionally blank, not a dev placeholder).
 */
function PhotoSlot({ src, initials, tint, name }: { src: string; initials: string; tint: string; name: string }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <div
        role="img"
        aria-label={name}
        style={{
          width: 128,
          height: 128,
          borderRadius: '50%',
          background: `linear-gradient(150deg, ${tint}, #2b2b33)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '2.4rem',
          letterSpacing: '1px',
          boxShadow: 'var(--shadow-soft)',
        }}
      >
        {initials}
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={`${name}, co-founder of Talkadoo`}
      width={128}
      height={128}
      onError={() => setFailed(true)}
      style={{ width: 128, height: 128, borderRadius: '50%', objectFit: 'cover', boxShadow: 'var(--shadow-soft)' }}
    />
  )
}

export default function Founders() {
  const ref = useReveal<HTMLElement>()

  return (
    <section
      ref={ref}
      id="founders"
      aria-labelledby="founders-title"
      style={{
        padding: 'clamp(3.5rem, 9vw, 6rem) clamp(1.2rem, 5vw, 3rem)',
        background: '#f5efe0',
      }}
    >
      <div style={{ maxWidth: 980, margin: '0 auto' }}>
        <h2 id="founders-title" data-reveal style={{ fontSize: 'clamp(1.9rem, 5vw, 3rem)', textAlign: 'center' }}>
          Meet the founders
        </h2>
        <p data-reveal style={{ textAlign: 'center', opacity: 0.8, maxWidth: 540, margin: '0.6rem auto 2.5rem' }}>
          The two people behind Talkadoo.
        </p>

        <div className="founder-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', alignItems: 'stretch', position: 'relative' }}>
          {FOUNDERS.map((f) => (
            <article
              key={f.name}
              data-reveal
              style={{
                background: '#fff',
                borderRadius: 26,
                padding: '2rem 1.6rem',
                boxShadow: 'var(--shadow-soft)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <PhotoSlot src={f.photo} initials={f.initials} tint={f.tint} name={f.name} />
              <h3 style={{ fontSize: '1.35rem', margin: '1rem 0 0.2rem' }}>{f.name}</h3>
              <p style={{ color: 'var(--color-purple)', fontWeight: 700, fontSize: '0.92rem', margin: '0 0 0.9rem' }}>
                {f.role}
              </p>

              {/* Draft bio — clearly marked, awaiting Maira's approval */}
              <span
                style={{
                  fontSize: '0.66rem',
                  fontWeight: 800,
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  color: 'var(--color-orange)',
                  background: '#fff3d6',
                  border: '1.5px dashed var(--color-orange)',
                  borderRadius: 999,
                  padding: '0.15rem 0.6rem',
                  marginBottom: '0.7rem',
                }}
              >
                Draft bio — Maira to approve
              </span>
              <p style={{ margin: 0, opacity: 0.9, fontSize: '0.96rem', lineHeight: 1.55 }}>{f.bio}</p>

              {/* LinkedIn slot */}
              <div style={{ marginTop: '1.1rem' }}>
                {f.linkedin ? (
                  <a href={f.linkedin} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 700, color: 'var(--color-purple)' }}>
                    LinkedIn ↗
                  </a>
                ) : (
                  <span
                    style={{
                      fontSize: '0.72rem',
                      color: 'var(--color-ink)',
                      background: '#eee7f7',
                      border: '1.5px dashed var(--color-purple)',
                      borderRadius: 999,
                      padding: '0.3rem 0.7rem',
                    }}
                  >
                    LinkedIn URL — to add
                  </span>
                )}
              </div>
            </article>
          ))}

          {/* Bouncy waves between the two founders (desktop) */}
          <div
            aria-hidden="true"
            className="founder-penguin"
            style={{ position: 'absolute', left: '50%', top: '-56px', transform: 'translateX(-50%)' }}
          >
            <Bouncy state="wave" size={96} />
          </div>
        </div>

        {/* Contact block */}
        <div
          data-reveal
          style={{
            marginTop: '2.5rem',
            background: '#fff',
            borderRadius: 26,
            padding: 'clamp(1.6rem, 5vw, 2.4rem)',
            boxShadow: 'var(--shadow-soft)',
            textAlign: 'center',
          }}
        >
          <h3 style={{ fontSize: '1.4rem', marginBottom: '0.6rem' }}>Come say hello</h3>
          <p style={{ maxWidth: 560, margin: '0 auto 1.3rem', opacity: 0.88 }}>
            Whether you’re a parent, a language or pedagogy expert, or someone who
            wants to help make Talkadoo real — we’d love to hear from you.
          </p>
          <a
            href="mailto:talkadoo.team@gmail.com"
            className="squish"
            style={{
              display: 'inline-block',
              background: 'var(--color-purple)',
              color: '#fff',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              padding: '0.85rem 1.6rem',
              borderRadius: 999,
              textDecoration: 'none',
              boxShadow: 'var(--shadow-pop)',
            }}
          >
            talkadoo.team@gmail.com
          </a>
          <p style={{ marginTop: '1.2rem', fontSize: '0.8rem', opacity: 0.5 }}>
            {/* Social links intentionally left for later — none invented. */}
            Social channels coming soon.
          </p>
        </div>
      </div>
    </section>
  )
}
