import { useState } from 'react'
import Bouncy from '../components/Bouncy'
import { useReveal } from '../hooks/useReveal'
import { LANGUAGES, type Lang } from '../data/vocab'
import type { BouncyState } from '../data/sprites'

export default function LanguagePeaks({
  lang,
  setLang,
}: {
  lang: Lang | null
  setLang: (l: Lang) => void
}) {
  const ref = useReveal<HTMLElement>()
  const [active, setActive] = useState(0)
  const [pose, setPose] = useState<BouncyState>('idle')

  function pick(i: number, code: Lang) {
    setActive(i)
    setLang(code)
    setPose('walk')
    window.setTimeout(() => setPose('jump'), 400)
  }

  return (
    <section
      ref={ref}
      id="peaks"
      aria-labelledby="peaks-title"
      style={{
        position: 'relative',
        overflow: 'hidden',
        padding: 'clamp(3.5rem, 9vw, 6rem) clamp(1.2rem, 5vw, 3rem) 4rem',
        background: 'linear-gradient(180deg, #cfe3a3 0%, #dfe4f2 45%, #ece6f8 100%)',
      }}
    >
      <div style={{ position: 'relative', zIndex: 2, maxWidth: 1000, margin: '0 auto' }}>
        <h2 id="peaks-title" data-reveal style={{ fontSize: 'clamp(1.9rem, 5vw, 3rem)', textAlign: 'center' }}>
          Four languages to climb
        </h2>
        <p data-reveal style={{ textAlign: 'center', opacity: 0.8, maxWidth: 560, margin: '0.6rem auto 2rem' }}>
          German, Spanish, Swedish, English. Point Bouncy at a peak to say hello.
        </p>

        {/* Bouncy rides above the peaks and waddles to the active one */}
        <div data-reveal style={{ position: 'relative', height: 120, marginBottom: 4 }}>
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              bottom: 0,
              left: `${((active + 0.5) / LANGUAGES.length) * 100}%`,
              transform: 'translateX(-50%)',
              transition: 'left 0.6s cubic-bezier(0.34,1.4,0.64,1)',
            }}
          >
            <Bouncy state={pose} size={110} onRest={() => setPose('idle')} />
          </div>
        </div>

        <div
          role="group"
          aria-label="Launch languages"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${LANGUAGES.length}, 1fr)`,
            gap: 'clamp(0.3rem, 2vw, 1rem)',
            alignItems: 'end',
          }}
        >
          {LANGUAGES.map((l, i) => {
            const on = i === active && lang === l.code
            const peakColor = ['#7A3FC4', '#E8912B', '#F58BA0', '#F5C542'][i]
            const peakLight = ['#b48ee0', '#f3b972', '#f9b6c4', '#f9dd8a'][i]
            return (
              <button
                key={l.code}
                type="button"
                onMouseEnter={() => pick(i, l.code)}
                onFocus={() => pick(i, l.code)}
                onClick={() => pick(i, l.code)}
                aria-pressed={on}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '0.3rem 0',
                }}
              >
                {/* crafted SVG mountain — gradient body, snow cap, soft outline */}
                <div
                  style={{
                    position: 'relative',
                    transform: on ? 'translateY(-8px)' : 'none',
                    filter: on ? 'saturate(1.1) brightness(1.03)' : 'saturate(0.92)',
                    transition: 'transform .3s cubic-bezier(0.34,1.4,0.64,1), filter .3s',
                  }}
                >
                  <svg
                    viewBox="0 0 120 120"
                    aria-hidden="true"
                    style={{
                      display: 'block',
                      width: 'clamp(84px, 24vw, 150px)',
                      height: 'auto',
                      filter: 'drop-shadow(0 8px 9px rgba(43,43,51,0.22))',
                    }}
                  >
                    <defs>
                      <linearGradient id={`peak-${i}`} x1="0" y1="0" x2="0.25" y2="1">
                        <stop offset="0" stopColor={peakLight} />
                        <stop offset="1" stopColor={peakColor} />
                      </linearGradient>
                    </defs>
                    {/* body */}
                    <path
                      d="M11 113 L60 12 L109 113 Z"
                      fill={`url(#peak-${i})`}
                      stroke="#2b2b33"
                      strokeOpacity="0.22"
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                    />
                    {/* soft shaded right facet */}
                    <path d="M60 12 L109 113 L72 113 Z" fill="#2b2b33" fillOpacity="0.08" />
                    {/* snow cap with a wavy hem */}
                    <path
                      d="M60 12 L43 47 Q49 43 54 46 Q60 41 66 46 Q71 43 77 47 Z"
                      fill="#ffffff"
                      stroke="#2b2b33"
                      strokeOpacity="0.12"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {/* flag planted at the summit */}
                  <span
                    aria-hidden="true"
                    style={{ position: 'absolute', top: '2%', left: '50%', transform: 'translateX(-50%)' }}
                  >
                    <img
                      src={l.flag}
                      alt=""
                      style={{
                        borderRadius: 4,
                        width: 'clamp(22px, 5.5vw, 34px)',
                        height: 'auto',
                      }}
                    />
                  </span>
                </div>
                <span
                  style={{
                    marginTop: '0.6rem',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: 'clamp(0.8rem, 2.5vw, 1.05rem)',
                    color: on ? 'var(--color-purple)' : 'var(--color-ink)',
                  }}
                >
                  {l.native}
                </span>
                <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>{l.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
