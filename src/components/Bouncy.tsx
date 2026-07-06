import { useEffect, useRef, useState } from 'react'
import { ANIMS, SHEET, type BouncyState } from '../data/sprites'
import { useReducedMotion } from '../hooks/useReducedMotion'

interface BouncyProps {
  state?: BouncyState
  /** Rendered height in px (width matches — frames are square). */
  size?: number
  /** Face left instead of right. */
  flip?: boolean
  className?: string
  style?: React.CSSProperties
  /** Fires when a non-looping animation finishes. */
  onRest?: () => void
}

/**
 * Bouncy the penguin — plays a sprite sheet by stepping background-position
 * through its 13 frames. One-shot poses play once then settle back to idle so
 * he always feels alive. Purely decorative: aria-hidden, and under
 * reduced-motion he simply shows a single friendly frame.
 */
export default function Bouncy({
  state = 'idle',
  size = 160,
  flip = false,
  className = '',
  style,
  onRest,
}: BouncyProps) {
  const reduced = useReducedMotion()
  const [active, setActive] = useState<BouncyState>(state)
  const frameRef = useRef(0)
  const rafRef = useRef<number | undefined>(undefined)
  const lastRef = useRef(0)

  // Adopt whatever the parent asks for.
  useEffect(() => setActive(state), [state])

  const anim = ANIMS[active]
  const boxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const box = boxRef.current
    if (!box) return

    // Reduced motion: show a single calm frame, no rAF loop.
    if (reduced) {
      paint(box, 0)
      return
    }

    frameRef.current = 0
    lastRef.current = 0
    const frameMs = 1000 / SHEET.fps

    const loop = (t: number) => {
      if (!lastRef.current) lastRef.current = t
      const elapsed = t - lastRef.current
      if (elapsed >= frameMs) {
        lastRef.current = t
        frameRef.current += 1

        if (frameRef.current >= SHEET.frames) {
          if (anim.loop) {
            frameRef.current = 0
          } else {
            // One-shot done → settle to idle and let the parent know.
            paint(box, SHEET.frames - 1)
            onRest?.()
            setActive((s) => (s === active ? 'idle' : s))
            return
          }
        }
        paint(box, frameRef.current)
      }
      rafRef.current = requestAnimationFrame(loop)
    }

    paint(box, 0)

    // Only burn frames while Bouncy is actually on screen — keeps idle CPU near
    // zero (crucial on mid-range phones) since most penguins are scrolled away.
    const start = () => {
      if (rafRef.current == null) {
        lastRef.current = 0
        rafRef.current = requestAnimationFrame(loop)
      }
    }
    const stop = () => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = undefined
      }
    }

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { rootMargin: '80px' },
    )
    io.observe(box)

    return () => {
      io.disconnect()
      stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, reduced])

  return (
    <div
      ref={boxRef}
      aria-hidden="true"
      className={className}
      style={{
        width: size,
        height: size,
        backgroundImage: `url(${SHEET.basePath}${anim.file})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: `${SHEET.columns * 100}% ${SHEET.rows * 100}%`,
        imageRendering: 'auto',
        transform: flip ? 'scaleX(-1)' : undefined,
        filter: 'drop-shadow(0 12px 10px rgba(43,43,51,0.18))',
        ...style,
      }}
    />
  )
}

/** Position the sheet so frame `i` (row-major, 4×4) fills the box. */
function paint(box: HTMLDivElement, i: number) {
  const col = i % SHEET.columns
  const row = Math.floor(i / SHEET.columns)
  const x = (col / (SHEET.columns - 1)) * 100
  const y = (row / (SHEET.rows - 1)) * 100
  box.style.backgroundPosition = `${x}% ${y}%`
}
