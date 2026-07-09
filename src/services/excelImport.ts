import * as XLSX from 'xlsx';
import { Word, WordRow } from '../models/Word';

/**
 * Erwartete Spaltennamen in der Excel-Datei.
 * Unterstützt deutsche und englische Varianten (Groß-/Kleinschreibung egal).
 */
const COLUMN_MAP: Record<string, keyof WordRow> = {
  schriftdeutsch: 'schriftdeutsch',
  schriftdeutsch_geschrieben: 'schriftdeutsch',
  hochdeutsch: 'schriftdeutsch',
  mundart: 'mundart',
  mundart_geschrieben: 'mundart',
  dialekt: 'mundart',
  bedeutung: 'bedeutung',
  bedeutung_mundart: 'bedeutung',
  meaning: 'bedeutung',
  audiodatei: 'audioDatei',
  sprachaufnahme_mundart: 'audioDatei',
  audio: 'audioDatei',
  audio_datei: 'audioDatei',
  sprecher: 'sprecher',
  speaker: 'sprecher',
  ort: 'ort',
  location: 'ort',
  datum: 'datum',
  date: 'datum',
};

/**
 * Mappt einen Excel-Spaltennamen auf das WordRow-Feld.
 */
function mapColumnName(header: string): keyof WordRow | null {
  const key = header.toLowerCase().trim().replace(/\s+/g, '_');
  return COLUMN_MAP[key] ?? null;
}

/**
 * Parst eine Excel-Datei (ArrayBuffer oder Base64) und gibt Word-Objekte zurück.
 */
export function parseExcelData(data: ArrayBuffer): Word[] {
  const workbook = XLSX.read(data, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    throw new Error('Die Excel-Datei enthält kein Arbeitsblatt.');
  }

  const sheet = workbook.Sheets[sheetName];
  const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: '',
  });

  if (rawRows.length === 0) {
    throw new Error('Die Excel-Datei enthält keine Datenzeilen.');
  }

  // Spaltenzuordnung aus der ersten Zeile ermitteln
  const firstRow = rawRows[0];
  const columnMapping: Record<string, keyof WordRow> = {};
  for (const header of Object.keys(firstRow)) {
    const field = mapColumnName(header);
    if (field) columnMapping[header] = field;
  }

  const words: Word[] = [];

  rawRows.forEach((row, index) => {
    const wordRow: WordRow = {};
    for (const [header, field] of Object.entries(columnMapping)) {
      const value = row[header];
      wordRow[field] = value != null ? String(value).trim() : '';
    }

    // Mindestens Mundart oder Schriftdeutsch muss vorhanden sein
    if (!wordRow.mundart && !wordRow.schriftdeutsch) return;

    words.push({
      id: `word-${index + 1}`,
      schriftdeutsch: wordRow.schriftdeutsch ?? '',
      mundart: wordRow.mundart ?? '',
      bedeutung: wordRow.bedeutung ?? '',
      audioDatei: wordRow.audioDatei ?? '',
      sprecher: wordRow.sprecher ?? '',
      ort: wordRow.ort ?? 'Groß-Umstadt',
      datum: wordRow.datum ?? '',
    });
  });

  return words;
}

/**
 * Liest eine Excel-Datei vom Dateisystem (für Import-Skripte).
 */
export function parseExcelFile(filePath: string): Word[] {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  return parseExcelData(buffer as ArrayBuffer);
}

/**
 * Validiert, ob eine Word-Liste importierbar ist.
 */
export function validateWords(words: Word[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (words.length === 0) {
    errors.push('Keine gültigen Wörter in der Datei gefunden.');
  }
  words.forEach((word, i) => {
    if (!word.mundart && !word.schriftdeutsch) {
      errors.push(`Zeile ${i + 1}: Mundart oder Schriftdeutsch fehlt.`);
    }
  });
  return { valid: errors.length === 0, errors };
}
