import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Word } from '../models/Word';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';

interface WordCardProps {
  word: Word;
  onPress: (word: Word) => void;
}

/**
 * Kompakte Wortkarte für die Wörterbuch-Liste.
 */
export function WordCard({ word, onPress }: WordCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={() => onPress(word)}
      accessibilityRole="button"
      accessibilityLabel={`${word.mundart}, bedeutet ${word.schriftdeutsch}`}
    >
      <View style={styles.content}>
        <Text style={styles.mundart}>{word.mundart}</Text>
        <Text style={styles.schriftdeutsch}>{word.schriftdeutsch}</Text>
        {word.bedeutung ? (
          <Text style={styles.bedeutung} numberOfLines={2}>
            {word.bedeutung}
          </Text>
        ) : null}
      </View>
      <Ionicons name="chevron-forward" size={28} color={Colors.primary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
    marginBottom: 12,
    minHeight: 80,
  },
  pressed: {
    backgroundColor: Colors.overlay,
  },
  content: {
    flex: 1,
  },
  mundart: {
    ...Typography.h3,
    color: Colors.primary,
  },
  schriftdeutsch: {
    ...Typography.body,
    color: Colors.text,
    marginTop: 4,
  },
  bedeutung: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 6,
  },
});
