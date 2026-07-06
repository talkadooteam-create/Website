// Decorative CSS/SVG play-shapes. All aria-hidden — pure scenery that fills gaps
// around Talkadoo's own artwork and drives colour, motion and parallax.

export function Star({
  size = 28,
  color = 'var(--color-gold)',
  className = '',
  style,
}: {
  size?: number
  color?: string
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      style={style}
    >
      <path
        fill={color}
        d="M12 1.8l2.7 6 6.5.6-4.9 4.3 1.5 6.4L12 15.9 6.2 19.1l1.5-6.4L2.8 8.4l6.5-.6z"
      />
    </svg>
  )
}

export function Dot({
  size = 16,
  color = 'var(--color-pink)',
  className = '',
  style,
}: {
  size?: number
  color?: string
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <span
      aria-hidden="true"
      className={className}
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        ...style,
      }}
    />
  )
}

export function Squiggle({
  width = 90,
  color = 'var(--color-purple)',
  className = '',
  style,
}: {
  width?: number
  color?: string
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <svg
      width={width}
      height={width * 0.3}
      viewBox="0 0 100 30"
      fill="none"
      aria-hidden="true"
      className={className}
      style={style}
    >
      <path
        d="M2 15c8-16 18 16 26 0s18-16 26 0 18 16 26 0"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function Rainbow({
  width = 220,
  className = '',
  style,
}: {
  width?: number
  className?: string
  style?: React.CSSProperties
}) {
  const bands = ['#F58BA0', '#E8912B', '#F5C542', '#CFE3A3', '#7A3FC4']
  return (
    <svg
      width={width}
      height={width * 0.55}
      viewBox="0 0 200 110"
      fill="none"
      aria-hidden="true"
      className={className}
      style={style}
    >
      {bands.map((c, i) => (
        <path
          key={c}
          d={`M${14 + i * 12} 105 a${86 - i * 12} ${86 - i * 12} 0 0 1 ${
            (86 - i * 12) * 2
          } 0`}
          stroke={c}
          strokeWidth="9"
          strokeLinecap="round"
        />
      ))}
    </svg>
  )
}

export function Bunting({
  count = 7,
  className = '',
  style,
}: {
  count?: number
  className?: string
  style?: React.CSSProperties
}) {
  const colors = ['#7A3FC4', '#F5C542', '#F58BA0', '#E8912B', '#CFE3A3']
  return (
    <svg
      viewBox={`0 0 ${count * 30} 46`}
      aria-hidden="true"
      className={className}
      style={{ width: '100%', maxWidth: count * 30, ...style }}
    >
      <path
        d={`M0 6 Q ${(count * 30) / 2} 22 ${count * 30} 6`}
        stroke="#2b2b3355"
        strokeWidth="2"
        fill="none"
      />
      {Array.from({ length: count }).map((_, i) => {
        const x = i * 30 + 6
        return (
          <path
            key={i}
            d={`M${x} 9 L${x + 18} 9 L${x + 9} 30 Z`}
            fill={colors[i % colors.length]}
          />
        )
      })}
    </svg>
  )
}

export function Balloon({
  color = 'var(--color-pink)',
  size = 54,
  className = '',
  style,
}: {
  color?: string
  size?: number
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <svg
      width={size}
      height={size * 1.5}
      viewBox="0 0 40 60"
      aria-hidden="true"
      className={className}
      style={style}
    >
      <ellipse cx="20" cy="20" rx="17" ry="20" fill={color} />
      <ellipse cx="14" cy="14" rx="4" ry="6" fill="#ffffff77" />
      <path d="M20 40 l-3 5 h6 z" fill={color} />
      <path d="M20 45 q4 8 -1 15" stroke="#2b2b3355" strokeWidth="1.5" fill="none" />
    </svg>
  )
}

/**
 * The jump-mat squares — Talkadoo's core motif. A row of glowing coloured tiles
 * like friendly game levels / stepping-stones. `lit` gives one an extra glow.
 */
export function JumpSquares({
  count = 4,
  lit = -1,
  size = 46,
  className = '',
}: {
  count?: number
  lit?: number
  size?: number
  className?: string
}) {
  const colors = ['#7A3FC4', '#E8912B', '#F5C542', '#F58BA0', '#CFE3A3']
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{ display: 'flex', gap: size * 0.34, alignItems: 'flex-end' }}
    >
      {Array.from({ length: count }).map((_, i) => {
        const c = colors[i % colors.length]
        const isLit = i === lit
        return (
          <span
            key={i}
            style={{
              width: size,
              height: size,
              borderRadius: size * 0.28,
              background: c,
              boxShadow: isLit
                ? `0 0 0 4px #fff, 0 0 22px 4px ${c}, inset 0 -6px 0 rgba(0,0,0,0.12)`
                : `inset 0 -6px 0 rgba(0,0,0,0.12), 0 6px 14px -6px ${c}`,
              transform: isLit ? 'translateY(-8px)' : undefined,
              transition: 'transform .3s, box-shadow .3s',
            }}
          />
        )
      })}
    </div>
  )
}
