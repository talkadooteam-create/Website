// ─────────────────────────────────────────────────────────
// Seed vocabulary for the Meadow — the concrete nouns kids meet first.
// Words + articles are taken straight from Talkadoo's own syllabus data
// (i18n.js): German der/die/das by real gender, Spanish el/la, Swedish en.
// NOTE: the brief listed "mouse", but Talkadoo has no mouse art or data yet,
// so we seed "duck" instead (real art + real words). Swap in mouse once it
// exists in the game data.
// ─────────────────────────────────────────────────────────

export type Lang = 'de' | 'es' | 'sv' | 'en'

export const LANGUAGES: { code: Lang; label: string; flag: string; native: string }[] = [
  { code: 'de', label: 'German', native: 'Deutsch', flag: './assets/flags/de.svg' },
  { code: 'es', label: 'Spanish', native: 'Español', flag: './assets/flags/es.svg' },
  { code: 'sv', label: 'Swedish', native: 'Svenska', flag: './assets/flags/se.svg' },
  { code: 'en', label: 'English', native: 'English', flag: './assets/flags/gb.svg' },
]

export interface Creature {
  key: string
  img: string
  /** Playful sound the creature "says" when tapped. */
  sound: string
  words: Record<Lang, { article: string; word: string }>
}

export const CREATURES: Creature[] = [
  {
    key: 'dog',
    img: './assets/animals/dog.png',
    sound: 'woof!',
    words: {
      en: { article: 'the', word: 'dog' },
      de: { article: 'der', word: 'Hund' },
      es: { article: 'el', word: 'perro' },
      sv: { article: 'en', word: 'hund' },
    },
  },
  {
    key: 'cat',
    img: './assets/animals/cat.png',
    sound: 'meow!',
    words: {
      en: { article: 'the', word: 'cat' },
      de: { article: 'die', word: 'Katze' },
      es: { article: 'el', word: 'gato' },
      sv: { article: 'en', word: 'katt' },
    },
  },
  {
    key: 'bird',
    img: './assets/animals/bird.png',
    sound: 'tweet!',
    words: {
      en: { article: 'the', word: 'bird' },
      de: { article: 'der', word: 'Vogel' },
      es: { article: 'el', word: 'pájaro' },
      sv: { article: 'en', word: 'fågel' },
    },
  },
  {
    key: 'horse',
    img: './assets/animals/horse.png',
    sound: 'neigh!',
    words: {
      en: { article: 'the', word: 'horse' },
      de: { article: 'das', word: 'Pferd' },
      es: { article: 'el', word: 'caballo' },
      sv: { article: 'en', word: 'häst' },
    },
  },
  {
    key: 'frog',
    img: './assets/animals/frog.png',
    sound: 'ribbit!',
    words: {
      en: { article: 'the', word: 'frog' },
      de: { article: 'der', word: 'Frosch' },
      es: { article: 'la', word: 'rana' },
      sv: { article: 'en', word: 'groda' },
    },
  },
  {
    key: 'cow',
    img: './assets/animals/cow.png',
    sound: 'moo!',
    words: {
      en: { article: 'the', word: 'cow' },
      de: { article: 'die', word: 'Kuh' },
      es: { article: 'la', word: 'vaca' },
      sv: { article: 'en', word: 'ko' },
    },
  },
  {
    key: 'fish',
    img: './assets/animals/fish.png',
    sound: 'blub!',
    words: {
      en: { article: 'the', word: 'fish' },
      de: { article: 'der', word: 'Fisch' },
      es: { article: 'el', word: 'pez' },
      sv: { article: 'en', word: 'fisk' },
    },
  },
  {
    key: 'duck',
    img: './assets/animals/duck.png',
    sound: 'quack!',
    words: {
      en: { article: 'the', word: 'duck' },
      de: { article: 'die', word: 'Ente' },
      es: { article: 'el', word: 'pato' },
      sv: { article: 'en', word: 'anka' },
    },
  },
]
