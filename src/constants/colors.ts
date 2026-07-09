/**
 * Farbpalette – hoher Kontrast, seniorenfreundlich.
 * Warme, regionale Töne mit klarer Lesbarkeit.
 */
export const Colors = {
  /** Dunkelgrün – Hauptfarbe (Odenwald-Bezug) */
  primary: '#1B4332',
  primaryLight: '#2D6A4F',
  /** Warmes Beige – Akzent */
  secondary: '#D4A574',
  secondaryLight: '#E8C9A0',
  /** Heller Hintergrund */
  background: '#FFFDF8',
  /** Karten und Eingabefelder */
  surface: '#FFFFFF',
  /** Haupttext – fast schwarz für maximalen Kontrast */
  text: '#1A1A1A',
  textSecondary: '#4A4A4A',
  /** Platzhalter in Eingabefeldern */
  placeholder: '#767676',
  /** Fehler- und Warnhinweise */
  error: '#B00020',
  success: '#2E7D32',
  /** Trennlinien */
  border: '#C4C4C4',
  /** Tab-Leiste */
  tabBar: '#FFFFFF',
  tabBarActive: '#1B4332',
  tabBarInactive: '#767676',
  /** Mikrofon-Button (Aussprache) */
  microphone: '#C1121F',
  microphoneActive: '#E63946',
  /** Audio-Wiedergabe */
  audio: '#1B4332',
  /** Überlagerung für aktive Zustände */
  overlay: 'rgba(27, 67, 50, 0.08)',
} as const;
