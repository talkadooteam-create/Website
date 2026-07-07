import { useReveal } from '../hooks/useReveal'
import { Star } from '../components/decor'

const TIMELINE = [
  { label: 'The idea', sub: 'Born in our bachelor studies', done: true },
  { label: 'Full-time', sub: 'Pursued in our entrepreneurship master’s', done: true },
  { label: 'Initial funding', sub: 'Secured to build & test our MVP', done: true },
  { label: 'Second MVP', sub: 'In development now', current: true },
  { label: 'Production research', sub: 'Toward the physical product', done: false },
  { label: 'Launch', sub: 'EU first', done: false },
]

export default function WhereWeAre() {
  const ref = useReveal<HTMLElement>()
  const currentIdx = TIMELINE.findIndex((t) => t.current)

  return (
    <section
      ref={ref}
      id="story"
      aria-labelledby="story-title"
      style={{
        padding: 'clamp(3.5rem, 9vw, 6rem) clamp(1.2rem, 5vw, 3rem)',
        background: 'linear-gradient(180deg, #fdf3d6 0%, #f5efe0 100%)',
      }}
    >
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <h2 id="story-title" data-reveal style={{ fontSize: 'clamp(1.9rem, 5vw, 3rem)', textAlign: 'center' }}>
          Where we are
        </h2>

        <div
          data-reveal
          style={{
            display: 'grid',
            gap: '1rem',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            margin: '2rem 0 3rem',
          }}
        >
          {[
            'We’re an early-stage EdTech startup building a movement-based way for young children to learn languages, off the screen and on their feet.',
            'We’ve secured our initial funding to build and test our MVP, and we’re now developing our second MVP, moving toward production research for the physical product. Want the detail? Get in touch, we’d love to talk.',
            'Our approach: keep testing with real parents and children, and work with pedagogy and language experts, so kids genuinely have fun and genuinely learn.',
          ].map((t, i) => (
            <p
              key={i}
              style={{
                background: '#fff',
                borderRadius: 20,
                padding: '1.3rem 1.4rem',
                boxShadow: 'var(--shadow-soft)',
                margin: 0,
                opacity: 0.92,
              }}
            >
              {t}
            </p>
          ))}
        </div>

        {/* Timeline of the journey so far */}
        <h3 data-reveal style={{ textAlign: 'center', fontSize: '1.2rem', opacity: 0.75, marginBottom: '1.5rem' }}>
          The story so far
        </h3>
        <div data-reveal style={{ overflowX: 'auto', paddingBottom: '0.5rem' }}>
          <div style={{ minWidth: 640, position: 'relative', padding: '0 1rem' }}>
            {/* the path line */}
            <div style={{ position: 'absolute', top: 12, left: '4%', right: '4%', height: 5, background: '#e3d9c2', borderRadius: 3 }} />
            <div
              style={{
                position: 'absolute',
                top: 12,
                left: '4%',
                width: `${(currentIdx / (TIMELINE.length - 1)) * 92}%`,
                height: 5,
                background: 'var(--color-orange)',
                borderRadius: 3,
              }}
            />

            <ol style={{ listStyle: 'none', display: 'grid', gridTemplateColumns: `repeat(${TIMELINE.length}, 1fr)`, padding: 0, margin: 0 }}>
              {TIMELINE.map((t) => (
                <li key={t.label} style={{ textAlign: 'center', position: 'relative', padding: '0 0.3rem' }}>
                  {t.current ? (
                    // The "we are here" node shines like a star.
                    <span
                      aria-hidden="true"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 34,
                        height: 34,
                        margin: '-3px auto 0.6rem',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, #fff3c9 0%, #fff3c900 70%)',
                      }}
                    >
                      <Star
                        size={30}
                        color="var(--color-gold)"
                        className="anim-twinkle"
                        style={{ filter: 'drop-shadow(0 0 6px #f5c542)' }}
                      />
                    </span>
                  ) : (
                    <span
                      aria-hidden="true"
                      style={{
                        display: 'block',
                        width: 22,
                        height: 22,
                        margin: '0 auto 0.6rem',
                        borderRadius: '50%',
                        background: t.done ? 'var(--color-orange)' : '#fff',
                        border: t.done ? 'none' : '3px solid #d8cdb4',
                      }}
                    />
                  )}
                  <strong style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: '0.95rem', color: t.current ? 'var(--color-purple)' : 'var(--color-ink)' }}>
                    {t.label}
                  </strong>
                  <span style={{ fontSize: '0.78rem', opacity: 0.7 }}>{t.sub}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
