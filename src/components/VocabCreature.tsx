import { useRef, useState } from 'react'
import type { Word, Lang } from '../data/vocab'
import { Star } from './decor'

/**
 * A tappable word tile. It's content, not decoration: a real focusable button.
 * Tap / Enter / Space makes it hop (squash-and-stretch) and pop a speech bubble
 * with the word + article in the chosen language — a taste of the real game.
 */
export default function VocabCreature({ word, lang }: { word: Word; lang: Lang }) {
  const [saying, setSaying] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  const { article, word: text } = word.words[lang]

  function speak() {
    setSaying(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setSaying(false), 2000)
  }

  const label = `${word.key}: ${article ? article + ' ' : ''}${text}. Tap to hear it.`

  return (
    <button
      type="button"
      onClick={speak}
      className="squish"
      style={{
        position: 'relative',
        background: 'transparent',
        border: 'none',
        padding: '0.4rem',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.2rem',
      }}
      aria-label={label}
    >
      {saying && (
        <span
          role="status"
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: 8,
            background: '#fff',
            border: '2.5px solid var(--color-ink)',
            borderRadius: 16,
            padding: '0.4rem 0.8rem',
            whiteSpace: 'nowrap',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            boxShadow: 'var(--shadow-soft)',
            animation: 'pop-in 0.3s ease',
            zIndex: 5,
          }}
        >
          {article && <span style={{ color: 'var(--color-purple)' }}>{article} </span>}
          {text}
          {word.sound && (
            <span style={{ opacity: 0.55, fontStyle: 'italic', fontSize: '0.85em' }}> {word.sound}</span>
          )}
          <span
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderTop: '10px solid var(--color-ink)',
            }}
          />
        </span>
      )}

      {saying && <Star size={20} className="anim-twinkle" style={{ position: 'absolute', top: -4, right: -2 }} />}

      <img
        src={word.img}
        alt=""
        width={92}
        height={92}
        loading="lazy"
        style={{
          width: 'clamp(58px, 16vw, 88px)',
          height: 'auto',
          transform: saying ? 'translateY(-10px) scale(1.08)' : undefined,
          transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1)',
        }}
      />
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-ink)' }}>
        {article && <span style={{ color: 'var(--color-purple)' }}>{article} </span>}
        {text}
      </span>
    </button>
  )
}
