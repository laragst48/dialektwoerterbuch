import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import * as DocumentPicker from 'expo-document-picker';
import { importedWords } from '../../data/importedWords';
import { Word } from '../models/Word';
import {
  getAllWords,
  getWordCount,
  importWords,
  initDatabase,
} from '../services/database';
import { parseExcelData, validateWords } from '../services/excelImport';
import { Strings } from '../constants/strings';

interface WordContextValue {
  words: Word[];
  loading: boolean;
  error: string | null;
  wordCount: number;
  refreshWords: () => Promise<void>;
  importFromExcel: () => Promise<{ success: boolean; message: string }>;
}

const WordContext = createContext<WordContextValue | null>(null);

/**
 * Stellt die Wortdatenbank app-weit bereit.
 * Lädt beim Start Beispieldaten, wenn die Datenbank leer ist.
 */
export function WordProvider({ children }: { children: React.ReactNode }) {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wordCount, setWordCount] = useState(0);

  const refreshWords = useCallback(async () => {
    try {
      setError(null);
      await initDatabase();
      const loaded = await getAllWords();
      setWords(loaded);
      setWordCount(loaded.length);
    } catch (err) {
      setError(Strings.common.error);
      console.error('Fehler beim Laden der Wörter:', err);
    }
  }, []);

  const initializeData = useCallback(async () => {
    setLoading(true);
    try {
      await initDatabase();
      const count = await getWordCount();

      // Beim ersten Start Wörter aus der Excel-Datenbank laden
      if (count === 0) {
        await importWords(importedWords);
      }

      await refreshWords();
    } catch (err) {
      setError(Strings.common.error);
      console.error('Initialisierungsfehler:', err);
    } finally {
      setLoading(false);
    }
  }, [refreshWords]);

  const importFromExcel = useCallback(async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-excel',
        ],
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets?.[0]) {
        return { success: false, message: 'Import abgebrochen.' };
      }

      const asset = result.assets[0];
      const response = await fetch(asset.uri);
      const buffer = await response.arrayBuffer();
      const parsed = parseExcelData(buffer);
      const validation = validateWords(parsed);

      if (!validation.valid) {
        return { success: false, message: validation.errors.join('\n') };
      }

      const count = await importWords(parsed);
      await refreshWords();
      return {
        success: true,
        message: Strings.common.importSuccess(count),
      };
    } catch (err) {
      console.error('Excel-Import fehlgeschlagen:', err);
      return { success: false, message: Strings.common.importError };
    }
  }, [refreshWords]);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  return (
    <WordContext.Provider
      value={{
        words,
        loading,
        error,
        wordCount,
        refreshWords,
        importFromExcel,
      }}
    >
      {children}
    </WordContext.Provider>
  );
}

export function useWords(): WordContextValue {
  const context = useContext(WordContext);
  if (!context) {
    throw new Error('useWords muss innerhalb von WordProvider verwendet werden.');
  }
  return context;
}
