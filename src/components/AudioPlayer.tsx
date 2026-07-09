import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { MIN_TOUCH_TARGET, Typography } from '../constants/typography';
import { Strings } from '../constants/strings';
import { useAudio } from '../hooks/useAudio';

interface AudioPlayerProps {
  audioUri: string | null | undefined;
  label?: string;
}

/**
 * Audio-Wiedergabe-Komponente für Dialekt-Sprachaufnahmen.
 */
export function AudioPlayer({ audioUri, label }: AudioPlayerProps) {
  const { isPlaying, isLoading, toggle } = useAudio(audioUri);

  if (!audioUri) {
    return (
      <View style={styles.container}>
        <Ionicons name="volume-mute" size={32} color={Colors.placeholder} />
        <Text style={styles.noAudio}>{Strings.dictionary.noAudio}</Text>
      </View>
    );
  }

  return (
    <Pressable
      style={({ pressed }) => [styles.playButton, pressed && styles.pressed]}
      onPress={toggle}
      accessibilityRole="button"
      accessibilityLabel={isPlaying ? Strings.common.pause : Strings.common.play}
    >
      {isLoading ? (
        <ActivityIndicator color={Colors.primary} size="large" />
      ) : (
        <Ionicons
          name={isPlaying ? 'pause-circle' : 'play-circle'}
          size={56}
          color={Colors.audio}
        />
      )}
      <Text style={styles.label}>
        {label ?? Strings.dictionary.labelAudio}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  noAudio: {
    ...Typography.caption,
    color: Colors.placeholder,
    fontStyle: 'italic',
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    minHeight: MIN_TOUCH_TARGET,
    paddingVertical: 8,
  },
  pressed: {
    opacity: 0.7,
  },
  label: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '600',
  },
});
