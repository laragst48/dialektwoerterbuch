import * as SQLite from 'expo-sqlite';
import { Word } from '../models/Word';
import { sortByMundart } from '../utils/normalize';

const DB_NAME = 'dialektwoerterbuch.db';

let db: SQLite.SQLiteDatabase | null = null;

/**
 * Öffnet die SQLite-Datenbank und erstellt die Tabelle bei Bedarf.
 */
export async function initDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;

  db = await SQLite.openDatabaseAsync(DB_NAME);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS words (
      id TEXT PRIMARY KEY NOT NULL,
      schriftdeutsch TEXT NOT NULL DEFAULT '',
      mundart TEXT NOT NULL DEFAULT '',
      bedeutung TEXT NOT NULL DEFAULT '',
      audioDatei TEXT NOT NULL DEFAULT '',
      sprecher TEXT NOT NULL DEFAULT '',
      ort TEXT NOT NULL DEFAULT '',
      datum TEXT NOT NULL DEFAULT ''
    );
    CREATE INDEX IF NOT EXISTS idx_mundart ON words(mundart);
    CREATE INDEX IF NOT EXISTS idx_schriftdeutsch ON words(schriftdeutsch);
  `);

  return db;
}

/** Mappt eine Datenbankzeile auf ein Word-Objekt */
function rowToWord(row: Record<string, unknown>): Word {
  return {
    id: String(row.id),
    schriftdeutsch: String(row.schriftdeutsch ?? ''),
    mundart: String(row.mundart ?? ''),
    bedeutung: String(row.bedeutung ?? ''),
    audioDatei: String(row.audioDatei ?? ''),
    sprecher: String(row.sprecher ?? ''),
    ort: String(row.ort ?? ''),
    datum: String(row.datum ?? ''),
  };
}

/**
 * Lädt alle Wörter aus der Datenbank, alphabetisch sortiert.
 */
export async function getAllWords(): Promise<Word[]> {
  const database = await initDatabase();
  const rows = await database.getAllAsync<Record<string, unknown>>(
    'SELECT * FROM words ORDER BY mundart COLLATE NOCASE ASC'
  );
  return sortByMundart(rows.map(rowToWord));
}

/**
 * Speichert ein einzelnes Wort (Einfügen oder Aktualisieren).
 */
export async function upsertWord(word: Word): Promise<void> {
  const database = await initDatabase();
  await database.runAsync(
    `INSERT OR REPLACE INTO words
     (id, schriftdeutsch, mundart, bedeutung, audioDatei, sprecher, ort, datum)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    word.id,
    word.schriftdeutsch,
    word.mundart,
    word.bedeutung,
    word.audioDatei,
    word.sprecher,
    word.ort,
    word.datum
  );
}

/**
 * Importiert eine Liste von Wörtern (ersetzt alle vorhandenen Daten).
 */
export async function importWords(words: Word[]): Promise<number> {
  const database = await initDatabase();
  await database.execAsync('BEGIN TRANSACTION');
  try {
    await database.execAsync('DELETE FROM words');
    for (const word of words) {
      await upsertWord(word);
    }
    await database.execAsync('COMMIT');
    return words.length;
  } catch (error) {
    await database.execAsync('ROLLBACK');
    throw error;
  }
}

/**
 * Sucht ein Wort anhand der ID.
 */
export async function getWordById(id: string): Promise<Word | null> {
  const database = await initDatabase();
  const row = await database.getFirstAsync<Record<string, unknown>>(
    'SELECT * FROM words WHERE id = ?',
    id
  );
  return row ? rowToWord(row) : null;
}

/**
 * Gibt die Anzahl gespeicherter Wörter zurück.
 */
export async function getWordCount(): Promise<number> {
  const database = await initDatabase();
  const result = await database.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM words'
  );
  return result?.count ?? 0;
}
