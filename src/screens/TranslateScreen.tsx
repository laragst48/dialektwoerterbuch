import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { TranslationDirection } from '../models/Word';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Strings } from '../constants/strings';
import { useWords } from '../context/WordContext';
import { translateWord } from '../services/searchService';
import { Button } from '../components/Button';
import { SearchInput } from '../components/SearchInput';
import { AudioPlayer } from '../components/AudioPlayer';

/**
 * Übersetzen-Screen – ähnlich wie Google Übersetzer.
 * Hochdeutsch ↔ Dialekt mit sofortiger Ergebnisanzeige.
 */
export function TranslateScreen() {
  const { words, loading } = useWords();
  const [query, setQuery] = useState('');
  const [direction, setDirection] = useState<TranslationDirection>(
    'hochdeutsch-zu-dialekt'
  );

  const result = useMemo(
    () => (query.trim() ? translateWord(words, query, direction) : null),
    [words, query, direction]
  );

  const toggleDirection = () => {
    setDirection((prev) =>
      prev === 'hochdeutsch-zu-dialekt'
        ? 'dialekt-zu-hochdeutsch'
        : 'hochdeutsch-zu-dialekt'
    );
    setQuery('');
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>{Strings.common.loading}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>{Strings.translate.title}</Text>
      <Text style={styles.subtitle}>{Strings.translate.subtitle}</Text>

      {/* Richtungswahl */}
      <View style={styles.directionRow}>
        <Button
          title={
            direction === 'hochdeutsch-zu-dialekt'
              ? Strings.translate.directionHochdeutsch
              : Strings.translate.directionDialekt
          }
          onPress={toggleDirection}
          variant="outline"
          accessibilityLabel="Übersetzungsrichtung wechseln"
        />
      </View>

      <Text style={styles.hint}>{Strings.translate.searchHint}</Text>

      {/* Eingabefeld */}
      <SearchInput
        value={query}
        onChangeText={setQuery}
        placeholder={Strings.translate.inputPlaceholder}
        accessibilityLabel="Wort zum Übersetzen eingeben"
      />

      {/* Ergebnis */}
      <View style={styles.resultBox}>
        <Text style={styles.resultLabel}>{Strings.translate.resultLabel}</Text>
        {result ? (
          <>
            <Text style={styles.resultMundart}>
              {direction === 'hochdeutsch-zu-dialekt'
                ? result.mundart
                : result.schriftdeutsch}
            </Text>
            <Text style={styles.resultSecondary}>
              {direction === 'hochdeutsch-zu-dialekt'
                ? result.schriftdeutsch
                : result.mundart}
            </Text>
            {result.bedeutung ? (
              <View style={styles.meaningBox}>
                <Text style={styles.meaningLabel}>
                  {Strings.translate.meaningLabel}
                </Text>
                <Text style={styles.meaningText}>{result.bedeutung}</Text>
              </View>
            ) : null}
            <AudioPlayer audioUri={result.audioDatei} />
          </>
        ) : query.trim() ? (
          <Text style={styles.noResult}>{Strings.translate.noResult}</Text>
        ) : (
          <Text style={styles.placeholder}>—</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 24,
    paddingBottom: 48,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    gap: 16,
  },
  loadingText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  title: {
    ...Typography.h1,
    color: Colors.primary,
    marginBottom: 4,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: 24,
  },
  directionRow: {
    marginBottom: 16,
  },
  hint: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  resultBox: {
    marginTop: 24,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.primary,
    padding: 24,
    minHeight: 160,
  },
  resultLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  resultMundart: {
    ...Typography.dialect,
    color: Colors.primary,
    marginBottom: 8,
  },
  resultSecondary: {
    ...Typography.h3,
    color: Colors.text,
    marginBottom: 16,
  },
  meaningBox: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  meaningLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginBottom: 6,
  },
  meaningText: {
    ...Typography.body,
    color: Colors.text,
  },
  noResult: {
    ...Typography.body,
    color: Colors.error,
    fontStyle: 'italic',
  },
  placeholder: {
    ...Typography.h2,
    color: Colors.placeholder,
  },
});
