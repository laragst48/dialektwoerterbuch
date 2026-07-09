/**
 * Datenmodell für ein Dialektwort aus der Excel-Datenbank.
 * Entspricht den Spalten: Schriftdeutsch, Mundart, Bedeutung, Audio, Sprecher, Ort, Datum
 */
export interface Word {
  /** Eindeutige ID (wird beim Import vergeben) */
  id: string;
  /** Hochdeutsches Wort bzw. Schriftform */
  schriftdeutsch: string;
  /** Dialektwort / Mundart */
  mundart: string;
  /** Erklärung der Bedeutung */
  bedeutung: string;
  /** Dateiname oder Pfad zur Audioaufnahme */
  audioDatei: string;
  /** Name des Sprechers */
  sprecher: string;
  /** Aufnahmeort */
  ort: string;
  /** Aufnahmedatum (ISO-String oder lesbares Datum) */
  datum: string;
}

/** Rohdaten aus einer Excel-Zeile vor der Validierung */
export interface WordRow {
  schriftdeutsch?: string;
  mundart?: string;
  bedeutung?: string;
  audioDatei?: string;
  sprecher?: string;
  ort?: string;
  datum?: string;
}

/** Suchrichtung für die Übersetzungsfunktion */
export type TranslationDirection = 'hochdeutsch-zu-dialekt' | 'dialekt-zu-hochdeutsch';
