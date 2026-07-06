// ─────────────────────────────────────────────────────────
// Bouncy sprite-sheet manifest (mirrors assets/bouncy/sprites.json).
// Every sheet is a 4×4 grid of 256×256 frames, 13 frames used, ~12fps.
// States map the brief's guide poses onto the sheets that actually exist.
// ─────────────────────────────────────────────────────────

export const SHEET = {
  frameWidth: 256,
  frameHeight: 256,
  columns: 4,
  rows: 4,
  frames: 13,
  fps: 12,
  basePath: './assets/bouncy/',
} as const

export type BouncyState =
  | 'idle' // ready / breathing
  | 'walk' // waddle
  | 'run'
  | 'jump'
  | 'turn' // twirl / spin
  | 'wave'
  | 'point'
  | 'cheer'
  | 'clap' // celebrate
  | 'dance'
  | 'see' // curious glance
  | 'sad' // trip / oops

interface Anim {
  file: string
  loop: boolean
}

export const ANIMS: Record<BouncyState, Anim> = {
  idle: { file: 'idle.png', loop: true },
  walk: { file: 'walk.png', loop: true },
  run: { file: 'run.png', loop: true },
  jump: { file: 'jump.png', loop: false },
  turn: { file: 'turn.png', loop: false },
  wave: { file: 'wave.png', loop: false },
  point: { file: 'point.png', loop: false },
  cheer: { file: 'cheer.png', loop: true },
  clap: { file: 'clap.png', loop: false },
  dance: { file: 'dance.png', loop: true },
  see: { file: 'see.png', loop: false },
  sad: { file: 'sad.png', loop: false },
}
