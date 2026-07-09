import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Word } from '../models/Word';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Strings } from '../constants/strings';
import { AudioPlayer } from './AudioPlayer';

interface WordDetailProps {
  word: Word;
}

interface DetailRowProps {
  label: string;
  value: string;
}

/** Einzelne Informationszeile in der Detailansicht */
function DetailRow({ label, value }: DetailRowProps) {
  if (!value) return null;
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

/**
 * Vollständige Detailansicht eines Dialektworts.
 */
export function WordDetail({ word }: WordDetailProps) {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.mundart}>{word.mundart}</Text>
      <Text style={styles.schriftdeutsch}>{word.schriftdeutsch}</Text>

      {word.bedeutung ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{Strings.dictionary.labelBedeutung}</Text>
          <Text style={styles.bedeutung}>{word.bedeutung}</Text>
        </View>
      ) : null}

      <View style={styles.section}>
        <AudioPlayer audioUri={word.audioDatei} />
      </View>

      <View style={styles.metaSection}>
        <DetailRow label={Strings.dictionary.labelSprecher} value={word.sprecher} />
        <DetailRow label={Strings.dictionary.labelOrt} value={word.ort} />
        <DetailRow label={Strings.dictionary.labelDatum} value={word.datum} />
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
  mundart: {
    ...Typography.dialect,
    color: Colors.primary,
    marginBottom: 8,
  },
  schriftdeutsch: {
    ...Typography.h2,
    color: Colors.text,
    marginBottom: 24,
  },
  section: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  bedeutung: {
    ...Typography.body,
    color: Colors.text,
  },
  metaSection: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
  },
  row: {
    marginBottom: 16,
  },
  label: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginBottom: 4,
  },
  value: {
    ...Typography.body,
    color: Colors.text,
  },
});
