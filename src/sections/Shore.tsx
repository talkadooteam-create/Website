import { useEffect, useState } from 'react'
import Bouncy from '../components/Bouncy'
import WaitlistForm from '../components/WaitlistForm'
import { JumpSquares, Star, Dot } from '../components/decor'
import { useReveal } from '../hooks/useReveal'
import type { Lang } from '../data/vocab'
import type { BouncyState } from '../data/sprites'

export default function Shore({
  lang,
  onSuccess,
}: {
  lang: Lang | null
  onSuccess: () => void
}) {
  const ref = useReveal<HTMLElement>()
  const [pose, setPose] = useState<BouncyState>('idle')

  // Bouncy waves hello shortly after arrival, then settles.
  useEffect(() => {
    const t = setTimeout(() => setPose('wave'), 700)
    return () => clearTimeout(t)
  }, [])

  return (
    <section
      ref={ref}
      id="shore"
      aria-labelledby="shore-title"
      style={{
        position: 'relative',
        minHeight: '100svh',
        overflow: 'hidden',
        background:
          'radial-gradient(120% 80% at 70% 0%, #efe7fb 0%, #f5efe0 55%, #fdf6e6 100%)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Sky scenery — parallax layers */}
      <div
        data-parallax="0.15"
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      >
        <div
          style={{
            position: 'absolute',
            top: '8%',
            right: '10%',
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #F5C542, #f3b731)',
            boxShadow: '0 0 80px 20px #f5c54255',
          }}
        />
        <Star size={26} className="anim-twinkle" style={{ position: 'absolute', top: '18%', left: '12%' }} />
        <Star size={18} className="anim-twinkle" style={{ position: 'absolute', top: '30%', left: '26%' }} />
        <Star size={22} className="anim-twinkle" style={{ position: 'absolute', top: '14%', right: '32%' }} />
        <Dot size={14} color="#7A3FC455" style={{ position: 'absolute', top: '40%', right: '18%' }} className="anim-bob" />
      </div>

      {/* Soft rolling shore at the bottom */}
      <div
        data-parallax="0.05"
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '-5%',
          right: '-5%',
          bottom: -2,
          height: '32%',
          background: 'linear-gradient(180deg, #f7efd8, #efe3c2)',
          borderRadius: '50% 50% 0 0 / 22% 22% 0 0',
        }}
      />

      {/* Top wordmark */}
      <header
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.1rem clamp(1rem, 4vw, 2.5rem)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '1.5rem',
            color: 'var(--color-purple)',
            letterSpacing: '0.5px',
          }}
        >
          Talkadoo
        </span>
        <a
          href="#summit"
          className="squish"
          style={{
            background: 'var(--color-gold)',
            color: 'var(--color-ink)',
            fontWeight: 800,
            fontFamily: 'var(--font-display)',
            padding: '0.55rem 1.1rem',
            borderRadius: 999,
            textDecoration: 'none',
            fontSize: '0.95rem',
          }}
        >
          Join the waitlist
        </a>
      </header>

      {/* Hero content */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          flex: 1,
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1fr)',
          alignItems: 'center',
          gap: '1rem',
          maxWidth: 1120,
          width: '100%',
          margin: '0 auto',
          padding: 'clamp(1rem, 3vw, 2rem) clamp(1.2rem, 5vw, 3rem) 3rem',
        }}
        className="shore-grid"
      >
        <div style={{ maxWidth: 620 }}>
          <p
            data-reveal
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              color: 'var(--color-orange)',
              margin: '0 0 0.5rem',
              fontSize: '1.05rem',
            }}
          >
            Let’s move, learn and have fun! 🐧
          </p>
          <h1
            id="shore-title"
            data-reveal
            style={{ fontSize: 'clamp(2.3rem, 6.5vw, 4rem)', letterSpacing: '-0.5px' }}
          >
            Kids learn a new language by{' '}
            <span style={{ color: 'var(--color-purple)' }}>jumping</span> for it.
          </h1>
          <p
            data-reveal
            style={{ fontSize: '1.15rem', margin: '1rem 0 1.5rem', maxWidth: 520 }}
          >
            A playful jump-mat for ages 4–7. Your child hears a word, then jumps to
            the matching square — moving, laughing and learning, right off the screen.
          </p>
          <div data-reveal>
            <WaitlistForm variant="hero" locale={lang} onSuccess={onSuccess} />
          </div>

          <div data-reveal style={{ marginTop: '2rem' }}>
            <JumpSquares count={4} lit={1} size={44} />
            <p style={{ fontSize: '0.8rem', opacity: 0.6, margin: '0.5rem 0 0' }}>
              Four glowing squares. One waiting jump.
            </p>
          </div>
        </div>

        {/* Bouncy greets the visitor */}
        <div
          className="shore-penguin"
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}
        >
          <Bouncy
            state={pose}
            size={260}
            onRest={() => setPose('idle')}
            className="anim-bob"
          />
        </div>
      </div>

      {/* Scroll hint */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 14,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2,
          fontSize: '0.8rem',
          opacity: 0.6,
          fontWeight: 700,
          fontFamily: 'var(--font-display)',
          textAlign: 'center',
        }}
        className="anim-bob"
      >
        follow Bouncy ↓
      </div>
    </section>
  )
}
