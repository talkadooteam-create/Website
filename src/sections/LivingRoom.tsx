import { useReveal } from '../hooks/useReveal'
import { Star, Dot } from '../components/decor'

const SPECS = [
  { emoji: '📺', title: 'Plugs into any TV', body: 'The mat connects to your telly, and the whole game plays on the big screen.' },
  { emoji: '📐', title: '96 × 96 cm', body: 'A nine-square play grid that fits neatly into any living room.' },
  { emoji: '🪶', title: '10 mm thin', body: 'Light and low-profile, so it rolls away in seconds when playtime’s over.' },
  { emoji: '🧼', title: 'Wipe-clean', body: 'Built for real family life: sturdy, soft underfoot and easy to clean.' },
]

export default function LivingRoom() {
  const ref = useReveal<HTMLElement>()

  // Play the real in-game voice clip ("Find the cat!") — a taste of what a child hears.
  function playCat() {
    const audio = new Audio('./audio/findthe_cat.mp3')
    audio.play().catch(() => {})
  }

  return (
    <section
      ref={ref}
      id="living-room"
      aria-labelledby="living-room-title"
      style={{
        position: 'relative',
        overflow: 'hidden',
        padding: 'clamp(3.5rem, 9vw, 6rem) clamp(1.2rem, 5vw, 3rem)',
        background: 'radial-gradient(120% 90% at 50% 0%, #efe7fb 0%, #f7efdd 60%, #f5efe0 100%)',
      }}
    >
      {/* floating scenery */}
      <div data-parallax="0.18" aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <Star size={22} className="anim-twinkle" style={{ position: 'absolute', top: '10%', left: '8%' }} />
        <Star size={16} className="anim-twinkle" style={{ position: 'absolute', top: '22%', right: '12%' }} />
        <Dot size={14} color="#7A3FC433" className="anim-bob" style={{ position: 'absolute', top: '40%', left: '14%' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 2, maxWidth: 1040, margin: '0 auto' }}>
        <h2 id="living-room-title" data-reveal style={{ fontSize: 'clamp(1.9rem, 5vw, 3rem)', textAlign: 'center' }}>
          See it in your living room
        </h2>
        <p data-reveal style={{ textAlign: 'center', opacity: 0.82, maxWidth: 600, margin: '0.7rem auto 2.5rem', fontSize: '1.1rem' }}>
          Hear a word, spot it on the TV, and jump to the right square on the mat.
          This is what an afternoon of Talkadoo really looks like.
        </p>

        {/* Hero: child playing, with animated callouts */}
        <div
          data-reveal
          style={{
            position: 'relative',
            maxWidth: 760,
            margin: '0 auto',
            borderRadius: 28,
            overflow: 'hidden',
            boxShadow: 'var(--shadow-pop)',
            border: '5px solid #fff',
            aspectRatio: '1402 / 1122',
          }}
        >
          <img
            src="./product/child-playing.jpg"
            alt="A child mid-jump on the Talkadoo mat in a living room, with the game showing on the TV"
            loading="lazy"
            className="ken-burns"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />

          {/* callout: near the TV — tap to actually hear the in-game voice */}
          <button
            type="button"
            onClick={playCat}
            className="anim-bob squish"
            aria-label="Play the voice clip: Find the cat!"
            style={{
              position: 'absolute',
              top: '9%',
              left: '4%',
              border: 'none',
              cursor: 'pointer',
              background: '#fff',
              color: 'var(--color-purple)',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 'clamp(0.72rem, 2.2vw, 1rem)',
              padding: '0.45rem 0.85rem',
              borderRadius: 999,
              boxShadow: 'var(--shadow-soft)',
            }}
          >
            🔊 “Find the cat!”
          </button>

          {/* callout: near the mat */}
          <span
            aria-hidden="true"
            className="anim-bob"
            style={{
              position: 'absolute',
              bottom: '8%',
              right: '5%',
              animationDelay: '0.7s',
              background: 'var(--color-gold)',
              color: 'var(--color-ink)',
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(0.72rem, 2.2vw, 1rem)',
              padding: '0.4rem 0.85rem',
              borderRadius: 999,
              boxShadow: 'var(--shadow-soft)',
            }}
          >
            👣 Jump to it!
          </span>
        </div>

        {/* Specs + the mat itself */}
        <div
          className="lr-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '1.5rem',
            alignItems: 'center',
            marginTop: '3rem',
          }}
        >
          {/* the mat, floating */}
          <div data-reveal style={{ textAlign: 'center' }}>
            <img
              src="./product/mat.jpg"
              alt="The Talkadoo mat: a soft nine-square grid with the penguin on the centre square"
              loading="lazy"
              className="anim-bob"
              style={{ width: '100%', maxWidth: 360, height: 'auto', filter: 'drop-shadow(0 20px 26px rgba(43,43,51,0.22))' }}
            />
          </div>

          {/* spec chips */}
          <div data-reveal style={{ display: 'grid', gap: '0.8rem' }}>
            {SPECS.map((s) => (
              <div
                key={s.title}
                style={{
                  display: 'flex',
                  gap: '0.9rem',
                  alignItems: 'center',
                  background: '#fff',
                  borderRadius: 18,
                  padding: '0.9rem 1.1rem',
                  boxShadow: '0 8px 22px -16px rgba(43,43,51,0.5)',
                }}
              >
                <span aria-hidden="true" style={{ fontSize: '1.6rem', flex: '0 0 auto' }}>
                  {s.emoji}
                </span>
                <div>
                  <strong style={{ fontFamily: 'var(--font-display)' }}>{s.title}</strong>
                  <p style={{ margin: '0.1rem 0 0', fontSize: '0.9rem', opacity: 0.78 }}>{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* the exact dimensions */}
        <div
          data-reveal
          style={{
            marginTop: '2rem',
            background: '#fffdf8',
            borderRadius: 24,
            padding: 'clamp(1rem, 3vw, 1.6rem)',
            boxShadow: 'var(--shadow-soft)',
            textAlign: 'center',
          }}
        >
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, margin: '0 0 0.8rem' }}>
            The mat, exactly
          </p>
          <img
            src="./product/dimensions.jpg"
            alt="Talkadoo mat dimensions: 96 by 96 cm, each square 30 by 30 cm, 10 mm thick"
            loading="lazy"
            style={{ width: '100%', maxWidth: 820, height: 'auto', borderRadius: 14 }}
          />
        </div>
      </div>
    </section>
  )
}
