// ─────────────────────────────────────────────────────────
// Meadow teaser vocabulary — a small taste per category, NOT the full list.
// Categories, words, and articles all come from Talkadoo's own syllabus data
// (data.js / i18n.js): German der/die/das from GERMAN_GENDER, Spanish el/la from
// SPANISH_ARTICLE. Colours/numbers/letters are intentionally excluded upstream
// because they take no article. Swedish + English are shown as the bare word
// (Swedish gender data isn't in the syllabus for these, so we don't guess).
// ─────────────────────────────────────────────────────────

export type Lang = 'de' | 'es' | 'sv' | 'en'

export const LANGUAGES: { code: Lang; label: string; flag: string; native: string }[] = [
  { code: 'de', label: 'German', native: 'Deutsch', flag: './assets/flags/de.svg' },
  { code: 'es', label: 'Spanish', native: 'Español', flag: './assets/flags/es.svg' },
  { code: 'sv', label: 'Swedish', native: 'Svenska', flag: './assets/flags/se.svg' },
  { code: 'en', label: 'English', native: 'English', flag: './assets/flags/gb.svg' },
]

export interface LangWord {
  article?: string // shown before the word (der/die/das, el/la); omitted where we don't have data
  word: string
}

export interface Word {
  key: string
  img: string
  sound?: string // playful sound for the speech bubble (animals only)
  words: Record<Lang, LangWord>
}

export interface Category {
  key: string
  label: string
  emoji: string
  words: Word[]
}

const img = (cat: string, key: string) => `./assets/${cat}/${key}.png`

export const CATEGORIES: Category[] = [
  {
    key: 'animals',
    label: 'Animals',
    emoji: '🐾',
    words: [
      { key: 'dog', img: img('animals', 'dog'), sound: 'woof!', words: { de: { article: 'der', word: 'Hund' }, es: { article: 'el', word: 'perro' }, sv: { word: 'hund' }, en: { word: 'dog' } } },
      { key: 'cat', img: img('animals', 'cat'), sound: 'meow!', words: { de: { article: 'die', word: 'Katze' }, es: { article: 'el', word: 'gato' }, sv: { word: 'katt' }, en: { word: 'cat' } } },
      { key: 'horse', img: img('animals', 'horse'), sound: 'neigh!', words: { de: { article: 'das', word: 'Pferd' }, es: { article: 'el', word: 'caballo' }, sv: { word: 'häst' }, en: { word: 'horse' } } },
    ],
  },
  {
    key: 'fruit',
    label: 'Fruit',
    emoji: '🍎',
    words: [
      { key: 'apple', img: img('fruits', 'apple'), words: { de: { article: 'der', word: 'Apfel' }, es: { article: 'la', word: 'manzana' }, sv: { word: 'äpple' }, en: { word: 'apple' } } },
      { key: 'banana', img: img('fruits', 'banana'), words: { de: { article: 'die', word: 'Banane' }, es: { article: 'el', word: 'plátano' }, sv: { word: 'banan' }, en: { word: 'banana' } } },
      { key: 'cherry', img: img('fruits', 'cherry'), words: { de: { article: 'die', word: 'Kirsche' }, es: { article: 'la', word: 'cereza' }, sv: { word: 'körsbär' }, en: { word: 'cherry' } } },
    ],
  },
  {
    key: 'food',
    label: 'Food',
    emoji: '🍞',
    words: [
      { key: 'bread', img: img('food', 'bread'), words: { de: { article: 'das', word: 'Brot' }, es: { article: 'el', word: 'pan' }, sv: { word: 'bröd' }, en: { word: 'bread' } } },
      { key: 'cake', img: img('food', 'cake'), words: { de: { article: 'der', word: 'Kuchen' }, es: { article: 'el', word: 'pastel' }, sv: { word: 'tårta' }, en: { word: 'cake' } } },
      { key: 'milk', img: img('food', 'milk'), words: { de: { article: 'die', word: 'Milch' }, es: { article: 'la', word: 'leche' }, sv: { word: 'mjölk' }, en: { word: 'milk' } } },
    ],
  },
  {
    key: 'home',
    label: 'Home',
    emoji: '🏠',
    words: [
      { key: 'chair', img: img('household', 'chair'), words: { de: { article: 'der', word: 'Stuhl' }, es: { article: 'la', word: 'silla' }, sv: { word: 'stol' }, en: { word: 'chair' } } },
      { key: 'book', img: img('household', 'book'), words: { de: { article: 'das', word: 'Buch' }, es: { article: 'el', word: 'libro' }, sv: { word: 'bok' }, en: { word: 'book' } } },
      { key: 'lamp', img: img('household', 'lamp'), words: { de: { article: 'die', word: 'Lampe' }, es: { article: 'la', word: 'lámpara' }, sv: { word: 'lampa' }, en: { word: 'lamp' } } },
    ],
  },
  {
    key: 'family',
    label: 'Family',
    emoji: '👪',
    words: [
      { key: 'mum', img: img('family', 'mum'), words: { de: { article: 'die', word: 'Mama' }, es: { article: 'la', word: 'mamá' }, sv: { word: 'mamma' }, en: { word: 'mum' } } },
      { key: 'dad', img: img('family', 'dad'), words: { de: { article: 'der', word: 'Papa' }, es: { article: 'el', word: 'papá' }, sv: { word: 'pappa' }, en: { word: 'dad' } } },
      { key: 'baby', img: img('family', 'baby'), words: { de: { article: 'das', word: 'Baby' }, es: { article: 'el', word: 'bebé' }, sv: { word: 'bebis' }, en: { word: 'baby' } } },
    ],
  },
  {
    key: 'body',
    label: 'Body',
    emoji: '✋',
    words: [
      { key: 'hand', img: img('body', 'hand'), words: { de: { article: 'die', word: 'Hand' }, es: { article: 'la', word: 'mano' }, sv: { word: 'hand' }, en: { word: 'hand' } } },
      { key: 'foot', img: img('body', 'foot'), words: { de: { article: 'der', word: 'Fuß' }, es: { article: 'el', word: 'pie' }, sv: { word: 'fot' }, en: { word: 'foot' } } },
      { key: 'eye', img: img('body', 'eye'), words: { de: { article: 'das', word: 'Auge' }, es: { article: 'el', word: 'ojo' }, sv: { word: 'öga' }, en: { word: 'eye' } } },
    ],
  },
]
