import Bouncy from '../components/Bouncy'
import { useReveal } from '../hooks/useReveal'
import { Star } from '../components/decor'

const PROPS = [
  {
    title: 'Moving, not scrolling',
    body: 'Talkadoo gets kids off the sofa and onto their feet. Learning happens through the body, not a touchscreen.',
    emoji: '🏃',
    color: 'var(--color-orange)',
  },
  {
    title: 'Built by an educator',
    body: 'Designed around how young children actually learn — grounded in pedagogy, tested with real families.',
    emoji: '🎓',
    color: 'var(--color-purple)',
  },
  {
    title: 'They think it’s a game',
    body: 'To your child it’s pure play: jump, giggle, celebrate. The learning rides along for free.',
    emoji: '🎮',
    color: 'var(--color-pink)',
  },
  {
    title: 'Nothing for you to run',
    body: 'No lesson plans, no homework, no screens to police. Plug in the mat and let them play.',
    emoji: '✅',
    color: 'var(--color-gold)',
  },
]

export default function Forest() {
  const ref = useReveal<HTMLElement>()

  return (
    <section
      ref={ref}
      id="forest"
      aria-labelledby="forest-title"
      style={{
        position: 'relative',
        overflow: 'hidden',
        padding: 'clamp(3.5rem, 9vw, 6rem) clamp(1.2rem, 5vw, 3rem)',
        background: 'linear-gradient(180deg, #e4f0d0 0%, #d6e8bd 55%, #cfe3a3 100%)',
      }}
    >
      {/* distant trees */}
      <div data-parallax="0.2" aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.5 }}>
        {[8, 24, 74, 90].map((left, i) => (
          <div
            key={left}
            style={{
              position: 'absolute',
              bottom: '10%',
              left: `${left}%`,
              width: 0,
              height: 0,
              borderLeft: `${34 + i * 4}px solid transparent`,
              borderRight: `${34 + i * 4}px solid transparent`,
              borderBottom: `${120 + i * 20}px solid #8bbf6a`,
              filter: 'blur(0.5px)',
            }}
          />
        ))}
        <Star size={20} color="#7A3FC4" className="anim-twinkle" style={{ position: 'absolute', top: '16%', left: '44%' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 2, maxWidth: 1120, margin: '0 auto' }}>
        <h2 id="forest-title" data-reveal style={{ fontSize: 'clamp(1.9rem, 5vw, 3rem)', textAlign: 'center' }}>
          Why parents love it
        </h2>
        <p data-reveal style={{ textAlign: 'center', opacity: 0.8, maxWidth: 560, margin: '0.6rem auto 2.5rem' }}>
          Four little clearings Bouncy walks you through.
        </p>

        <div
          style={{
            display: 'grid',
            gap: '1.2rem',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          }}
        >
          {PROPS.map((p) => (
            <article
              key={p.title}
              data-reveal
              style={{
                background: '#fffdf7',
                borderRadius: 26,
                padding: '2rem 1.5rem',
                boxShadow: 'var(--shadow-soft)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: `${p.color}22`,
                  fontSize: '1.9rem',
                  marginBottom: '1rem',
                }}
              >
                {p.emoji}
              </span>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.4rem', color: p.color === 'var(--color-gold)' ? 'var(--color-orange)' : p.color }}>
                {p.title}
              </h3>
              <p style={{ margin: 0, opacity: 0.85 }}>{p.body}</p>
            </article>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2.5rem' }}>
          <Bouncy state="point" size={150} />
        </div>
      </div>
    </section>
  )
}
