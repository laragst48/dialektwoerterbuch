import { useCallback, useEffect, useRef, useState } from 'react';
import { Audio } from 'expo-av';

interface UseAudioResult {
  isPlaying: boolean;
  isLoading: boolean;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  toggle: () => Promise<void>;
}

/**
 * Hook für die Audio-Wiedergabe von Dialekt-Sprachaufnahmen.
 * @param audioUri URI oder Dateiname der Audioaufnahme
 */
export function useAudio(audioUri: string | null | undefined): UseAudioResult {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Audio-Modus für Wiedergabe konfigurieren
  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
    });
  }, []);

  // Sound beim Unmount freigeben
  useEffect(() => {
    return () => {
      soundRef.current?.unloadAsync();
    };
  }, []);

  const loadSound = useCallback(async () => {
    if (!audioUri) return null;

    setIsLoading(true);
    try {
      // Lokale Dateien aus assets/audio/ oder Remote-URLs
      let source: { uri: string } | number;
      if (audioUri.startsWith('http')) {
        source = { uri: audioUri };
      } else {
        // Für Entwicklung: Platzhalter – echte Dateien in assets/audio/ ablegen
        source = { uri: audioUri };
      }

      const { sound } = await Audio.Sound.createAsync(source, { shouldPlay: false });
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setIsPlaying(status.isPlaying);
          if (status.didJustFinish) {
            setIsPlaying(false);
          }
        }
      });
      soundRef.current = sound;
      return sound;
    } catch (error) {
      console.warn('Audio konnte nicht geladen werden:', audioUri, error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [audioUri]);

  const play = useCallback(async () => {
    if (!soundRef.current) {
      await loadSound();
    }
    await soundRef.current?.replayAsync();
    setIsPlaying(true);
  }, [loadSound]);

  const pause = useCallback(async () => {
    await soundRef.current?.pauseAsync();
    setIsPlaying(false);
  }, []);

  const toggle = useCallback(async () => {
    if (isPlaying) {
      await pause();
    } else {
      await play();
    }
  }, [isPlaying, play, pause]);

  return { isPlaying, isLoading, play, pause, toggle };
}
