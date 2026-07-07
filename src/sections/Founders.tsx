import { useState } from 'react'
import Bouncy from '../components/Bouncy'
import { useReveal } from '../hooks/useReveal'

interface Founder {
  name: string
  role: string
  linkedin: string | null // null → not provided yet
  bio: string
}

const FOUNDERS: Founder[] = [
  {
    name: 'Maira Haecker',
    role: 'Co-founder · pedagogy, product & design',
    linkedin: 'https://www.linkedin.com/in/mairahaecker1502',
    bio: 'Maira grew up with a single mother determined to raise her across five languages, and saw first-hand how much work that took, for parent and child alike. Later, as an international student, she kept meeting the same struggle everywhere: learning a language the hard way, at a desk. She became convinced kids learn best the way they play: moving, laughing, exploring, not sitting still in front of a screen. The idea for Talkadoo began during her bachelor studies with friends, and she went on to pursue it full-time during her entrepreneurship master’s.',
  },
  {
    name: 'Ahmed Magdy Ali (“Ali”)',
    role: 'Co-founder · technology & engineering · based in Sweden',
    linkedin: 'https://www.linkedin.com/in/ali-a-a9812595/',
    bio: 'Ali joined Maira in the entrepreneurship master’s program, where the two started working together, and it clicked immediately. He speaks many languages and has taught them to others, so he understands first-hand the struggle Talkadoo is built to solve. He fell for the idea and its potential, fully committed, and today drives the project forward, leading the technology and building the game alongside Maira.',
  },
]

/**
 * One shared founders photo in a soft rounded frame. Shows the real image once
 * founders-together.jpg is added to /public; until then, a clean labelled slot.
 */
function SharedPhoto() {
  const [failed, setFailed] = useState(false)
  const frame: React.CSSProperties = {
    width: '100%',
    maxWidth: 380,
    margin: '0 auto',
    borderRadius: 28,
    overflow: 'hidden',
    boxShadow: 'var(--shadow-soft)',
    border: '5px solid #fff',
  }

  if (failed) {
    return (
      <div
        role="img"
        aria-label="Maira and Ali, the founders of Talkadoo"
        style={{
          ...frame,
          aspectRatio: '3 / 2',
          background: 'linear-gradient(150deg, #efe7fb, #f7e7ef)',
          border: '3px dashed var(--color-purple)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '1rem',
          gap: '0.3rem',
        }}
      >
        <span style={{ fontSize: '2.2rem' }}>📷</span>
        <strong style={{ fontFamily: 'var(--font-display)' }}>Maira &amp; Ali</strong>
        <code style={{ fontSize: '0.72rem', opacity: 0.7 }}>add founders-together.jpg</code>
      </div>
    )
  }

  return (
    <img
      src="./founders-together.jpg"
      alt="Maira and Ali, the founders of Talkadoo, together"
      onError={() => setFailed(true)}
      style={{ ...frame, display: 'block', height: 'auto', objectFit: 'cover' }}
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
        <p data-reveal style={{ textAlign: 'center', opacity: 0.8, maxWidth: 540, margin: '0.6rem auto 2rem' }}>
          The two people behind Talkadoo.
        </p>

        {/* One shared photo of both founders, with Bouncy waving alongside */}
        <div data-reveal style={{ position: 'relative', marginBottom: '2.5rem' }}>
          <SharedPhoto />
          <div aria-hidden="true" className="founder-penguin" style={{ position: 'absolute', right: 'calc(50% - 250px)', bottom: -10 }}>
            <Bouncy state="wave" size={84} />
          </div>
        </div>

        {/* Both founders side by side — balanced, equal spacing */}
        <div
          className="founder-grid"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', alignItems: 'stretch' }}
        >
          {FOUNDERS.map((f) => (
            <article
              key={f.name}
              data-reveal
              style={{
                background: '#fff',
                borderRadius: 26,
                padding: '1.8rem 1.6rem',
                boxShadow: 'var(--shadow-soft)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <h3 style={{ fontSize: '1.35rem', margin: '0 0 0.2rem' }}>{f.name}</h3>
              <p style={{ color: 'var(--color-purple)', fontWeight: 700, fontSize: '0.92rem', margin: '0 0 0.9rem' }}>
                {f.role}
              </p>
              <p style={{ margin: 0, opacity: 0.9, fontSize: '0.96rem', lineHeight: 1.55 }}>{f.bio}</p>

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
                    LinkedIn URL to add
                  </span>
                )}
              </div>
            </article>
          ))}
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
            wants to help make Talkadoo real, we’d love to hear from you.
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
