import { useState } from 'react'
import Bouncy from '../components/Bouncy'
import WaitlistForm from '../components/WaitlistForm'
import { useReveal } from '../hooks/useReveal'
import { Balloon, Bunting, Star } from '../components/decor'
import type { BouncyState } from '../data/sprites'

export default function Summit({ onCelebrate }: { onCelebrate: () => void }) {
  const ref = useReveal<HTMLElement>()
  const [pose, setPose] = useState<BouncyState>('idle')
  const [party, setParty] = useState(false)

  function handleSuccess() {
    setParty(true)
    setPose('cheer')
    onCelebrate() // confetti burst (App level)
  }

  return (
    <section
      ref={ref}
      id="summit"
      aria-labelledby="summit-title"
      style={{
        position: 'relative',
        overflow: 'hidden',
        padding: 'clamp(4rem, 10vw, 7rem) clamp(1.2rem, 5vw, 3rem)',
        background: 'radial-gradient(120% 90% at 50% 0%, #ece6f8 0%, #f7e7ef 55%, #fdf3d6 100%)',
        textAlign: 'center',
      }}
    >
      {/* Bunting + balloons */}
      <div aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <Bunting count={9} />
      </div>
      <Balloon color="var(--color-pink)" className="anim-bob" style={{ position: 'absolute', top: '14%', left: '8%' }} />
      <Balloon color="var(--color-purple)" size={44} className="anim-bob" style={{ position: 'absolute', top: '22%', right: '10%', animationDelay: '0.6s' }} />
      <Star size={22} className="anim-twinkle" style={{ position: 'absolute', top: '10%', left: '30%' }} />
      <Star size={18} className="anim-twinkle" style={{ position: 'absolute', top: '18%', right: '32%' }} />

      <div style={{ position: 'relative', zIndex: 2, maxWidth: 640, margin: '0 auto' }}>
        <div data-reveal style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <Bouncy state={pose} size={190} onRest={() => setPose(party ? 'cheer' : 'idle')} className={party ? '' : 'anim-bob'} />
        </div>

        <h2 id="summit-title" data-reveal style={{ fontSize: 'clamp(2rem, 6vw, 3.4rem)' }}>
          Be first on the mat
        </h2>
        <p data-reveal style={{ fontSize: '1.15rem', opacity: 0.85, margin: '0.8rem auto 1.8rem', maxWidth: 480 }}>
          Join the waitlist and we’ll let you know the moment Talkadoo is ready to
          play. Free to join, EU launch first, and absolutely no spam.
        </p>

        <div data-reveal style={{ display: 'flex', justifyContent: 'center' }}>
          <WaitlistForm variant="full" onSuccess={handleSuccess} />
        </div>
      </div>
    </section>
  )
}
