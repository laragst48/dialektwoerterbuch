/**
 * Typografie – große Schriftgrößen für ältere Nutzer und Schüler.
 * Mindestgröße 18px, Überschriften deutlich größer.
 */
export const Typography = {
  /** Sehr große Überschrift (Screen-Titel) */
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
  },
  /** Abschnittsüberschrift */
  h2: {
    fontSize: 26,
    fontWeight: '600' as const,
    lineHeight: 34,
  },
  /** Unterüberschrift */
  h3: {
    fontSize: 22,
    fontWeight: '600' as const,
    lineHeight: 30,
  },
  /** Normaler Fließtext */
  body: {
    fontSize: 20,
    fontWeight: '400' as const,
    lineHeight: 28,
  },
  /** Kleinerer Text (Metadaten) */
  caption: {
    fontSize: 18,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  /** Große Buttons */
  button: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  /** Dialektwort in Ergebnissen – besonders hervorgehoben */
  dialect: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 36,
  },
} as const;

/** Mindestgröße für tippbare Elemente (Accessibility) */
export const MIN_TOUCH_TARGET = 56;
