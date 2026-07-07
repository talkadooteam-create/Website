import { useEffect, useState } from 'react'
import { getGames, type Game } from '../../lib/games'

/**
 * Games area. It only reads from getGames(); when that returns an empty list
 * (today's stub — no `games` table yet) it shows the "coming soon" state. Point
 * getGames() at a real Supabase table later and this component lights up unchanged.
 */
export default function GamesSection() {
  const [games, setGames] = useState<Game[] | null>(null)

  useEffect(() => {
    getGames().then(setGames)
  }, [])

  return (
    <section
      aria-labelledby="games-heading"
      style={{ background: '#fff', borderRadius: 24, padding: 'clamp(1.3rem, 4vw, 2rem)', boxShadow: 'var(--shadow-soft)' }}
    >
      <h2 id="games-heading" style={{ fontSize: '1.35rem', marginBottom: '0.3rem' }}>
        Games
      </h2>

      {games && games.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.9rem', marginTop: '1rem' }}>
          {games.map((g) => (
            <article key={g.id} style={{ background: '#faf6ee', borderRadius: 16, padding: '1rem' }}>
              <div style={{ fontSize: '1.8rem' }}>{g.emoji}</div>
              <h3 style={{ fontSize: '1rem', margin: '0.4rem 0 0.2rem' }}>{g.title}</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.75 }}>{g.description}</p>
            </article>
          ))}
        </div>
      ) : (
        <div
          style={{
            marginTop: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            background: 'linear-gradient(180deg, #f7f3ea, #f0ebe0)',
            border: '2px dashed #2b2b3320',
            borderRadius: 16,
            padding: '1.4rem',
          }}
        >
          <span aria-hidden="true" style={{ fontSize: '2.2rem' }}>🎮</span>
          <div>
            <p style={{ margin: 0, fontWeight: 800, fontFamily: 'var(--font-display)' }}>Games coming soon</p>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.9rem', opacity: 0.75 }}>
              We’re busy building playful ways for your child to learn. New games will show up right here.
            </p>
          </div>
        </div>
      )}
    </section>
  )
}
