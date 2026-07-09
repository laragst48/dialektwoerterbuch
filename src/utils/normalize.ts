/**
 * Normalisiert Text für die Suche – Kleinbuchstaben, Umlaute vereinheitlichen.
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss');
}

/**
 * Prüft, ob der Suchbegriff im Zieltext vorkommt (Teilstring-Suche).
 */
export function matchesSearch(query: string, target: string): boolean {
  if (!query.trim()) return true;
  return normalizeText(target).includes(normalizeText(query));
}

/**
 * Sortiert Wörter alphabetisch nach Mundart.
 */
export function sortByMundart<T extends { mundart: string }>(words: T[]): T[] {
  return [...words].sort((a, b) =>
    a.mundart.localeCompare(b.mundart, 'de', { sensitivity: 'base' })
  );
}
