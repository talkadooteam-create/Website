import { Suspense, lazy, useCallback, useState } from 'react'
import Shore from './sections/Shore'
import Meadow from './sections/Meadow'
import { celebrate } from './lib/confetti'
import type { Lang } from './data/vocab'

// Later regions are lazy-loaded so the hero paints fast on 4G.
const Forest = lazy(() => import('./sections/Forest'))
const LanguagePeaks = lazy(() => import('./sections/LanguagePeaks'))
const Summit = lazy(() => import('./sections/Summit'))
const WhereWeAre = lazy(() => import('./sections/WhereWeAre'))
const Founders = lazy(() => import('./sections/Founders'))

const Loading = () => (
  <div style={{ minHeight: 220, display: 'grid', placeItems: 'center', opacity: 0.5 }}>
    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>loading…</span>
  </div>
)

export default function App() {
  const [lang, setLang] = useState<Lang | null>(null)

  const handleCelebrate = useCallback(() => {
    celebrate({ x: window.innerWidth / 2, y: window.innerHeight / 3 })
  }, [])

  return (
    <>
      <a href="#summit" className="skip-link">
        Skip to the waitlist
      </a>

      <main>
        <Shore lang={lang} onSuccess={handleCelebrate} />
        <Meadow lang={lang} setLang={setLang} />
        <Suspense fallback={<Loading />}>
          <Forest />
          <LanguagePeaks lang={lang} setLang={setLang} />
          <Summit lang={lang} onCelebrate={handleCelebrate} />
          <WhereWeAre />
          <Founders />
        </Suspense>
      </main>

      <footer
        style={{
          background: 'var(--color-ink)',
          color: '#f5efe0',
          textAlign: 'center',
          padding: '2.5rem 1.2rem',
        }}
      >
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.4rem', color: 'var(--color-gold)', margin: '0 0 0.4rem' }}>
          Talkadoo
        </p>
        <p style={{ margin: '0 0 0.8rem', opacity: 0.8 }}>Let’s move, learn and have fun!</p>
        <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.65 }}>
          <a href="mailto:talkadoo.team@gmail.com" style={{ color: '#f5efe0' }}>
            talkadoo.team@gmail.com
          </a>{' '}
          · Made with care in the EU 🇪🇺
        </p>
      </footer>
    </>
  )
}
