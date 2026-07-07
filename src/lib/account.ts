import { supabase } from './supabase'
import type { Lang } from '../data/vocab'

// ─────────────────────────────────────────────────────────
// Parent account data layer. Column names verified against the live Supabase
// schema (talkadoo_supabase_apply_all.sql):
//   children(id TEXT app-generated, parent_id uuid=auth.uid() default,
//            nickname, age_band ∈ '4-5'|'5-6'|'6-7', avatar, l1, target, created_at)
//   consents(parent_id uuid=auth.uid() default, version, accepted_at) PK(parent_id,version)
//   learning_events(child_id, word, category, correct, word_state ∈ 'new'|'learning'|'mastered', occurred_at, …)
// RLS scopes every read/write to the signed-in parent; parent_id is filled by a
// column default, so the client never sends it.
// ─────────────────────────────────────────────────────────

/** Bumped whenever the consent wording below changes; recorded per parent in `consents`. */
export const CONSENT_VERSION = 'child-profile-consent-2026-07-06'

export const CONSENT_TEXT =
  'I confirm I am the parent or legal guardian and I consent to creating a profile ' +
  'for my child and to Talkadoo storing my child’s learning progress. Our users are ' +
  'children aged 4–7, so this data is handled with GDPR care and kept to a minimum.'

export type AgeBand = '4-5' | '5-6' | '6-7'

export const AGE_BANDS: { value: AgeBand; label: string }[] = [
  { value: '4-5', label: '4–5 years' },
  { value: '5-6', label: '5–6 years' },
  { value: '6-7', label: '6–7 years' },
]

/** Learning languages map to the game's `target` codes. */
export const TARGET_LANGUAGES: { value: Lang; label: string }[] = [
  { value: 'de', label: 'German' },
  { value: 'es', label: 'Spanish' },
  { value: 'sv', label: 'Swedish' },
  { value: 'en', label: 'English' },
]

export interface Child {
  id: string
  parent_id?: string
  nickname: string | null
  age_band: AgeBand | null
  avatar: string | null
  l1: string | null
  target: string | null
  created_at?: string
}

export interface ChildInput {
  nickname: string
  age_band: AgeBand
  target: Lang
  avatar?: string
}

function requireClient() {
  if (!supabase) throw new Error('Supabase is not configured (missing .env.local credentials).')
  return supabase
}

/** App-generated child id, matching the game's shape (e.g. 'c_0i9r1z'). */
function newChildId() {
  return 'c_' + Math.random().toString(36).slice(2, 8) + Math.random().toString(36).slice(2, 4)
}

// ── Consent ────────────────────────────────────────────────
/** Record the parent's consent (idempotent — a duplicate is treated as success). */
export async function recordConsent(): Promise<void> {
  const db = requireClient()
  const { error } = await db.from('consents').insert({ version: CONSENT_VERSION })
  if (error && error.code !== '23505') throw error // 23505 = already recorded
}

export async function hasConsent(): Promise<boolean> {
  const db = requireClient()
  const { data, error } = await db
    .from('consents')
    .select('version')
    .eq('version', CONSENT_VERSION)
    .limit(1)
  if (error) throw error
  return (data?.length ?? 0) > 0
}

// ── Children CRUD ──────────────────────────────────────────
export async function listChildren(): Promise<Child[]> {
  const db = requireClient()
  const { data, error } = await db
    .from('children')
    .select('id, nickname, age_band, avatar, l1, target, created_at')
    .order('created_at', { ascending: true })
  if (error) throw error
  return (data ?? []) as Child[]
}

export async function createChild(input: ChildInput): Promise<Child> {
  const db = requireClient()
  // parent_id is filled by the column default (auth.uid()); id is app-generated.
  const row = {
    id: newChildId(),
    nickname: input.nickname.trim(),
    age_band: input.age_band,
    target: input.target,
    avatar: input.avatar ?? '🐧',
  }
  const { data, error } = await db.from('children').insert(row).select().single()
  if (error) throw error
  return data as Child
}

export async function updateChild(
  id: string,
  patch: Partial<Pick<Child, 'nickname' | 'age_band' | 'target' | 'avatar'>>,
): Promise<void> {
  const db = requireClient()
  const { error } = await db.from('children').update(patch).eq('id', id)
  if (error) throw error
}

export async function deleteChild(id: string): Promise<void> {
  const db = requireClient()
  // ON DELETE CASCADE removes this child's learning_events / progress / review too.
  const { error } = await db.from('children').delete().eq('id', id)
  if (error) throw error
}

// ── Progress ───────────────────────────────────────────────
export type WordState = 'new' | 'learning' | 'mastered'

export interface CategoryProgress {
  category: string
  new: string[]
  learning: string[]
  learned: string[] // word_state === 'mastered'
}

export interface ChildProgress {
  categories: CategoryProgress[]
  totals: { new: number; learning: number; learned: number }
}

/**
 * Build a per-child progress view from learning_events: for each word we take its
 * most-recent word_state, then group words by category into new / learning / learned.
 * (progress & review exist too but are game-internal jsonb blobs — not needed here.)
 */
export async function getChildProgress(childId: string): Promise<ChildProgress> {
  const db = requireClient()
  const { data, error } = await db
    .from('learning_events')
    .select('word, category, word_state, occurred_at')
    .eq('child_id', childId)
    .order('occurred_at', { ascending: true })
  if (error) throw error

  // Latest state wins (rows are ascending, so the last one seen per word is newest).
  const latest = new Map<string, { category: string; state: WordState }>()
  for (const ev of (data ?? []) as { word: string; category: string; word_state: WordState }[]) {
    if (!ev.word) continue
    latest.set(ev.word, { category: ev.category || 'other', state: ev.word_state || 'new' })
  }

  const byCat = new Map<string, CategoryProgress>()
  const totals = { new: 0, learning: 0, learned: 0 }
  for (const [word, { category, state }] of latest) {
    let cat = byCat.get(category)
    if (!cat) {
      cat = { category, new: [], learning: [], learned: [] }
      byCat.set(category, cat)
    }
    if (state === 'mastered') {
      cat.learned.push(word)
      totals.learned++
    } else if (state === 'learning') {
      cat.learning.push(word)
      totals.learning++
    } else {
      cat.new.push(word)
      totals.new++
    }
  }

  return {
    categories: [...byCat.values()].sort((a, b) => a.category.localeCompare(b.category)),
    totals,
  }
}
