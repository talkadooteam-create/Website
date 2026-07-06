import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Reveals direct children (marked with [data-reveal]) as the section scrolls in,
 * and gives background layers ([data-parallax="0.2"]) a gentle scrubbed drift.
 * Fully disabled under prefers-reduced-motion — content is visible immediately.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>('[data-reveal]', root)
      if (items.length) {
        gsap.from(items, {
          opacity: 0,
          y: 40,
          duration: 0.7,
          ease: 'power2.out',
          stagger: 0.12,
          scrollTrigger: { trigger: root, start: 'top 78%' },
        })
      }

      // Scrubbed parallax: each layer drifts proportional to its data-parallax factor.
      gsap.utils.toArray<HTMLElement>('[data-parallax]', root).forEach((layer) => {
        const factor = parseFloat(layer.dataset.parallax || '0.2')
        gsap.fromTo(
          layer,
          { yPercent: -factor * 40 },
          {
            yPercent: factor * 40,
            ease: 'none',
            scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return ref
}
