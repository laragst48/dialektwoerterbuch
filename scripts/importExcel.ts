/**
 * Kommandozeilen-Skript zum Import einer Excel-Datei in JSON.
 *
 * Verwendung:
 *   npx ts-node scripts/importExcel.ts pfad/zur/datei.xlsx
 *
 * Erzeugt eine JSON-Datei unter data/importedWords.json,
 * die als Referenz oder für manuelle Datenbank-Updates dient.
 */
import * as fs from 'fs';
import * as path from 'path';
import { parseExcelFile, validateWords } from '../src/services/excelImport';

const inputPath = process.argv[2];

if (!inputPath) {
  console.error('Bitte Excel-Datei angeben:');
  console.error('  npx ts-node scripts/importExcel.ts pfad/zur/datei.xlsx');
  process.exit(1);
}

const absolutePath = path.resolve(inputPath);

if (!fs.existsSync(absolutePath)) {
  console.error(`Datei nicht gefunden: ${absolutePath}`);
  process.exit(1);
}

try {
  console.log(`Importiere: ${absolutePath}`);
  const words = parseExcelFile(absolutePath);
  const validation = validateWords(words);

  if (!validation.valid) {
    console.error('Validierungsfehler:');
    validation.errors.forEach((e) => console.error(`  - ${e}`));
    process.exit(1);
  }

  const outputPath = path.resolve(__dirname, '../data/importedWords.json');
  fs.writeFileSync(outputPath, JSON.stringify(words, null, 2), 'utf-8');

  console.log(`✓ ${words.length} Wörter erfolgreich importiert.`);
  console.log(`  Ausgabe: ${outputPath}`);
} catch (error) {
  console.error('Import fehlgeschlagen:', error);
  process.exit(1);
}
