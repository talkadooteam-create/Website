// Tiny, dependency-free confetti burst. Draws a handful of Talkadoo-coloured
// bits on a throwaway full-screen canvas, then removes itself. Cheap enough for
// a mid-range phone; a no-op when the user prefers reduced motion.

const COLORS = ['#7A3FC4', '#F5C542', '#F58BA0', '#E8912B', '#CFE3A3']

interface Bit {
  x: number
  y: number
  vx: number
  vy: number
  rot: number
  vr: number
  size: number
  color: string
  shape: 'rect' | 'circle'
}

export function celebrate(origin?: { x: number; y: number }, count = 90) {
  if (typeof window === 'undefined') return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const canvas = document.createElement('canvas')
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  canvas.style.cssText =
    'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:60'
  canvas.width = window.innerWidth * dpr
  canvas.height = window.innerHeight * dpr
  document.body.appendChild(canvas)
  const ctx = canvas.getContext('2d')!
  ctx.scale(dpr, dpr)

  const ox = origin?.x ?? window.innerWidth / 2
  const oy = origin?.y ?? window.innerHeight / 3

  const bits: Bit[] = Array.from({ length: count }, () => {
    const angle = Math.random() * Math.PI * 2
    const speed = 4 + Math.random() * 7
    return {
      x: ox,
      y: oy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 4,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      size: 6 + Math.random() * 8,
      color: COLORS[(Math.random() * COLORS.length) | 0],
      shape: Math.random() > 0.5 ? 'rect' : 'circle',
    }
  })

  let frame = 0
  const gravity = 0.22
  function tick() {
    frame++
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (const b of bits) {
      b.vy += gravity
      b.x += b.vx
      b.y += b.vy
      b.rot += b.vr
      ctx.save()
      ctx.translate(b.x, b.y)
      ctx.rotate(b.rot)
      ctx.globalAlpha = Math.max(0, 1 - frame / 130)
      ctx.fillStyle = b.color
      if (b.shape === 'rect') {
        ctx.fillRect(-b.size / 2, -b.size / 2, b.size, b.size * 0.6)
      } else {
        ctx.beginPath()
        ctx.arc(0, 0, b.size / 2, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.restore()
    }
    if (frame < 130) {
      requestAnimationFrame(tick)
    } else {
      canvas.remove()
    }
  }
  requestAnimationFrame(tick)
}
