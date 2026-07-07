import Bouncy from '../components/Bouncy'
import VocabCreature from '../components/VocabCreature'
import { useReveal } from '../hooks/useReveal'
import { Squiggle } from '../components/decor'
import { CATEGORIES, LANGUAGES, type Lang } from '../data/vocab'

const STEPS = [
  {
    n: 1,
    title: 'Connect the mat',
    body: 'Plug the Talkadoo mat into your TV. That’s the whole setup, no app store maze, no fiddling.',
    color: 'var(--color-orange)',
    emoji: '🔌',
  },
  {
    n: 2,
    title: 'Listen & jump',
    body: 'A friendly voice says a word. Your child spots the right square and jumps onto it.',
    color: 'var(--color-purple)',
    emoji: '👂',
  },
  {
    n: 3,
    title: 'Words that stick',
    body: 'Because they moved to learn it, the word sticks, through playful repetition and real progress.',
    color: 'var(--color-pink)',
    emoji: '✨',
  },
]

export default function Meadow({
  lang,
  setLang,
}: {
  lang: Lang | null
  setLang: (l: Lang) => void
}) {
  const ref = useReveal<HTMLElement>()
  const activeLang: Lang = lang ?? 'de'

  return (
    <section
      ref={ref}
      id="meadow"
      aria-labelledby="meadow-title"
      style={{
        position: 'relative',
        overflow: 'hidden',
        padding: 'clamp(3.5rem, 9vw, 6rem) clamp(1.2rem, 5vw, 3rem)',
        background: 'linear-gradient(180deg, #fdf6e6 0%, #eef6dc 40%, #e4f0d0 100%)',
      }}
    >
      {/* grass hills */}
      <div
        data-parallax="0.1"
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '-5%',
          right: '-5%',
          bottom: 0,
          height: '40%',
          background: 'radial-gradient(80% 100% at 50% 100%, #cfe3a3, #bcd88e)',
          borderRadius: '50% 50% 0 0 / 30% 30% 0 0',
          opacity: 0.7,
        }}
      />

      <div style={{ position: 'relative', zIndex: 2, maxWidth: 1120, margin: '0 auto' }}>
        <h2
          id="meadow-title"
          data-reveal
          style={{ fontSize: 'clamp(1.9rem, 5vw, 3rem)', textAlign: 'center' }}
        >
          How it works
        </h2>
        <Squiggle width={110} className="anim-sway" style={{ display: 'block', margin: '0.5rem auto 2.5rem' }} />

        {/* Three stops */}
        <ol
          className="meadow-steps"
          style={{
            listStyle: 'none',
            padding: 0,
            margin: '0 0 3.5rem',
            display: 'grid',
            gap: '1.2rem',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          }}
        >
          {STEPS.map((s) => (
            <li
              key={s.n}
              data-reveal
              style={{
                background: '#fff',
                borderRadius: 24,
                padding: '1.6rem 1.4rem',
                boxShadow: 'var(--shadow-soft)',
                border: `3px solid ${s.color}22`,
                position: 'relative',
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 52,
                  height: 52,
                  borderRadius: 16,
                  background: s.color,
                  color: '#fff',
                  fontWeight: 800,
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.4rem',
                  marginBottom: '0.9rem',
                }}
              >
                {s.emoji}
              </span>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.4rem' }}>
                <span style={{ color: s.color }}>{s.n}.</span> {s.title}
              </h3>
              <p style={{ margin: 0, opacity: 0.85 }}>{s.body}</p>
            </li>
          ))}
        </ol>

        {/* The living meadow — tappable vocabulary */}
        <div data-reveal style={{ textAlign: 'center' }}>
          <p style={{ fontWeight: 700, fontFamily: 'var(--font-display)', fontSize: '1.15rem', margin: '0 0 0.3rem' }}>
            Meet the first words, tap one to hear it
          </p>
          <p style={{ opacity: 0.7, margin: '0 0 1.2rem' }}>
            A taste from a few categories, each word with its real article. Pick a language:
          </p>

          {/* Language switch for the meadow */}
          <div
            role="group"
            aria-label="Choose a language for the words"
            style={{ display: 'inline-flex', gap: '0.4rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '1.8rem' }}
          >
            {LANGUAGES.map((l) => {
              const on = l.code === activeLang
              return (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setLang(l.code)}
                  aria-pressed={on}
                  className="squish"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.4rem 0.8rem',
                    borderRadius: 999,
                    border: on ? '2.5px solid var(--color-purple)' : '2.5px solid #2b2b3322',
                    background: on ? '#fff' : '#ffffffaa',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'var(--font-display)',
                  }}
                >
                  <img src={l.flag} alt="" width={22} height={16} style={{ borderRadius: 3 }} />
                  {l.native}
                </button>
              )
            })}
          </div>

          {/* A small taste per category — real game images, 2–4 words each */}
          <div style={{ display: 'grid', gap: '1rem', maxWidth: 880, margin: '0 auto' }}>
            {CATEGORIES.map((cat) => (
              <div
                key={cat.key}
                style={{
                  background: '#ffffffcc',
                  borderRadius: 22,
                  padding: '1rem 0.8rem 1.2rem',
                  boxShadow: '0 8px 24px -18px rgba(43,43,51,0.4)',
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '1rem',
                    margin: '0 0 0.6rem',
                    color: 'var(--color-ink)',
                  }}
                >
                  <span aria-hidden="true" style={{ marginRight: '0.35rem' }}>
                    {cat.emoji}
                  </span>
                  {cat.label}
                </p>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${cat.words.length}, minmax(0, 1fr))`,
                    gap: '0.4rem',
                    justifyItems: 'center',
                  }}
                >
                  {cat.words.map((w) => (
                    <VocabCreature key={w.key} word={w} lang={activeLang} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p style={{ opacity: 0.6, fontSize: '0.9rem', fontStyle: 'italic', margin: '1.2rem 0 0' }}>
            …and more words and categories as we grow.
          </p>
        </div>

        {/* Bouncy waddles through the grass */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
          <Bouncy state="walk" size={150} />
        </div>
      </div>
    </section>
  )
}
