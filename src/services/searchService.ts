import { Word, TranslationDirection } from '../models/Word';
import { matchesSearch, normalizeText } from '../utils/normalize';

/**
 * Sucht Wörter in der Datenbank anhand eines Suchbegriffs.
 * Durchsucht Mundart, Schriftdeutsch und Bedeutung.
 */
export function searchWords(words: Word[], query: string): Word[] {
  if (!query.trim()) return words;
  return words.filter(
    (word) =>
      matchesSearch(query, word.mundart) ||
      matchesSearch(query, word.schriftdeutsch) ||
      matchesSearch(query, word.bedeutung)
  );
}

/**
 * Übersetzt ein Wort je nach Richtung (Hochdeutsch ↔ Dialekt).
 * Gibt das beste Trefferergebnis zurück oder null.
 */
export function translateWord(
  words: Word[],
  query: string,
  direction: TranslationDirection
): Word | null {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return null;

  const field =
    direction === 'hochdeutsch-zu-dialekt' ? 'schriftdeutsch' : 'mundart';

  // Exakte Übereinstimmung zuerst
  const exactMatch = words.find(
    (word) => normalizeText(word[field]) === normalizedQuery
  );
  if (exactMatch) return exactMatch;

  // Teilstring-Übereinstimmung
  const partialMatches = words.filter((word) =>
    matchesSearch(query, word[field])
  );
  return partialMatches.length > 0 ? partialMatches[0] : null;
}

/**
 * Findet ein Wort anhand gesprochenem Text (Speech-to-Text-Ergebnis).
 * Sucht in Mundart und Schriftdeutsch.
 */
export function findBySpokenText(words: Word[], spokenText: string): Word | null {
  const normalized = normalizeText(spokenText);
  if (!normalized) return null;

  // Exakte Treffer in Mundart bevorzugen
  const exactMundart = words.find(
    (word) => normalizeText(word.mundart) === normalized
  );
  if (exactMundart) return exactMundart;

  const exactSchrift = words.find(
    (word) => normalizeText(word.schriftdeutsch) === normalized
  );
  if (exactSchrift) return exactSchrift;

  // Fuzzy: Teilstring in Mundart
  const partialMundart = words.find((word) =>
    normalizeText(word.mundart).includes(normalized)
  );
  if (partialMundart) return partialMundart;

  return (
    words.find((word) =>
      normalizeText(word.schriftdeutsch).includes(normalized)
    ) ?? null
  );
}

/**
 * Gruppiert Wörter alphabetisch nach Anfangsbuchstabe der Mundart.
 */
export function groupByLetter(words: Word[]): Map<string, Word[]> {
  const groups = new Map<string, Word[]>();
  for (const word of words) {
    const letter = (word.mundart[0] ?? '#').toUpperCase();
    const group = groups.get(letter) ?? [];
    group.push(word);
    groups.set(letter, group);
  }
  return groups;
}
