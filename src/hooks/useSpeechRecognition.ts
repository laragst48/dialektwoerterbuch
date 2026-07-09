import { useCallback, useEffect, useState } from 'react';
import Voice, {
  SpeechErrorEvent,
  SpeechResultsEvent,
} from '@react-native-voice/voice';

interface UseSpeechRecognitionResult {
  isListening: boolean;
  recognizedText: string;
  error: string | null;
  startListening: () => Promise<void>;
  stopListening: () => Promise<void>;
  reset: () => void;
}

/**
 * Hook für Speech-to-Text (Spracherkennung).
 * Erkennt gesprochene Dialektwörter über das Mikrofon.
 */
export function useSpeechRecognition(): UseSpeechRecognitionResult {
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Voice.onSpeechStart = () => setIsListening(true);
    Voice.onSpeechEnd = () => setIsListening(false);
    Voice.onSpeechError = (event: SpeechErrorEvent) => {
      setIsListening(false);
      setError(event.error?.message ?? 'Spracherkennung fehlgeschlagen.');
    };
    Voice.onSpeechResults = (event: SpeechResultsEvent) => {
      const text = event.value?.[0] ?? '';
      setRecognizedText(text);
    };
    Voice.onSpeechPartialResults = (event: SpeechResultsEvent) => {
      const text = event.value?.[0] ?? '';
      if (text) setRecognizedText(text);
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startListening = useCallback(async () => {
    try {
      setError(null);
      setRecognizedText('');
      // Deutsch als Erkennungssprache
      await Voice.start('de-DE');
    } catch (err) {
      setError('Mikrofon konnte nicht gestartet werden.');
      console.error('Speech start error:', err);
    }
  }, []);

  const stopListening = useCallback(async () => {
    try {
      await Voice.stop();
      setIsListening(false);
    } catch (err) {
      console.error('Speech stop error:', err);
    }
  }, []);

  const reset = useCallback(() => {
    setRecognizedText('');
    setError(null);
  }, []);

  return {
    isListening,
    recognizedText,
    error,
    startListening,
    stopListening,
    reset,
  };
}
