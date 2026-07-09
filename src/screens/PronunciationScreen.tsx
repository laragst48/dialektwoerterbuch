import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { MIN_TOUCH_TARGET, Typography } from '../constants/typography';
import { Strings } from '../constants/strings';
import { useWords } from '../context/WordContext';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { findBySpokenText } from '../services/searchService';
import { AudioPlayer } from '../components/AudioPlayer';

/**
 * Aussprache-Screen – Spracheingabe per Mikrofon und Übersetzung.
 */
export function PronunciationScreen() {
  const { words, loading } = useWords();
  const {
    isListening,
    recognizedText,
    error: speechError,
    startListening,
    stopListening,
    reset,
  } = useSpeechRecognition();

  const matchedWord = useMemo(
    () => (recognizedText ? findBySpokenText(words, recognizedText) : null),
    [words, recognizedText]
  );

  const handleMicrophonePress = async () => {
    if (isListening) {
      await stopListening();
    } else {
      reset();
      await startListening();
    }
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
    >
      <Text style={styles.title}>{Strings.pronunciation.title}</Text>
      <Text style={styles.subtitle}>{Strings.pronunciation.subtitle}</Text>
      <Text style={styles.hint}>{Strings.pronunciation.tapMicrophone}</Text>

      {/* Großer Mikrofon-Button */}
      <View style={styles.microphoneContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.microphoneButton,
            isListening && styles.microphoneActive,
            pressed && styles.microphonePressed,
          ]}
          onPress={handleMicrophonePress}
          accessibilityRole="button"
          accessibilityLabel={
            isListening
              ? Strings.pronunciation.speakingLabel
              : Strings.pronunciation.speakLabel
          }
        >
          <Ionicons
            name={isListening ? 'mic' : 'mic-outline'}
            size={72}
            color="#FFFFFF"
          />
        </Pressable>
        <Text style={styles.microphoneLabel}>
          {isListening
            ? Strings.pronunciation.speakingLabel
            : Strings.pronunciation.speakLabel}
        </Text>
      </View>

      {/* Erkanntes Wort */}
      {recognizedText ? (
        <View style={styles.recognizedBox}>
          <Text style={styles.recognizedLabel}>
            {Strings.pronunciation.recognizedLabel}
          </Text>
          <Text style={styles.recognizedText}>{recognizedText}</Text>
        </View>
      ) : null}

      {speechError ? (
        <Text style={styles.error}>{speechError}</Text>
      ) : null}

      {/* Übersetzungsergebnis */}
      {recognizedText && !isListening ? (
        <View style={styles.resultBox}>
          {matchedWord ? (
            <>
              <Text style={styles.resultMundart}>{matchedWord.mundart}</Text>
              <Text style={styles.resultSchrift}>{matchedWord.schriftdeutsch}</Text>
              {matchedWord.bedeutung ? (
                <Text style={styles.resultBedeutung}>{matchedWord.bedeutung}</Text>
              ) : null}
              <AudioPlayer audioUri={matchedWord.audioDatei} />
            </>
          ) : (
            <Text style={styles.noMatch}>{Strings.pronunciation.noMatch}</Text>
          )}
        </View>
      ) : null}
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
    alignItems: 'center',
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
    alignSelf: 'flex-start',
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  hint: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: 32,
    alignSelf: 'flex-start',
  },
  microphoneContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  microphoneButton: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Colors.microphone,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: MIN_TOUCH_TARGET,
    minHeight: MIN_TOUCH_TARGET,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  microphoneActive: {
    backgroundColor: Colors.microphoneActive,
  },
  microphonePressed: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }],
  },
  microphoneLabel: {
    ...Typography.body,
    color: Colors.text,
    marginTop: 16,
    fontWeight: '600',
  },
  recognizedBox: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
    marginBottom: 16,
  },
  recognizedLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginBottom: 8,
  },
  recognizedText: {
    ...Typography.h3,
    color: Colors.text,
  },
  error: {
    ...Typography.body,
    color: Colors.error,
    marginBottom: 16,
    textAlign: 'center',
  },
  resultBox: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.primary,
    padding: 24,
  },
  resultMundart: {
    ...Typography.dialect,
    color: Colors.primary,
    marginBottom: 8,
  },
  resultSchrift: {
    ...Typography.h3,
    color: Colors.text,
    marginBottom: 12,
  },
  resultBedeutung: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  noMatch: {
    ...Typography.body,
    color: Colors.error,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
