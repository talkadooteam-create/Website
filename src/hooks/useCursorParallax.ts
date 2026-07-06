import { useEffect, useRef } from 'react'

/**
 * Subtle desktop cursor parallax: the element drifts a few px toward the cursor
 * for depth. Disabled on touch / coarse pointers and under reduced-motion, and
 * driven directly on the DOM (no React re-renders) so it stays cheap.
 */
export function useCursorParallax<T extends HTMLElement = HTMLDivElement>(strength = 14) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return

    let raf = 0
    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2
      const ny = (e.clientY / window.innerHeight - 0.5) * 2
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate3d(${nx * strength}px, ${ny * strength}px, 0)`
      })
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [strength])

  return ref
}
