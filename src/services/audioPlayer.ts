import { api } from './api'

interface Recording {
  id: string
  word_id: string
  word_text: string
  mundart?: string
  schriftdeutsch?: string
}

let recordingsCache: Recording[] | null = null
let currentAudio: HTMLAudioElement | null = null

async function ensureCache(): Promise<Recording[]> {
  if (!recordingsCache) {
    try {
      recordingsCache = await api.audio.getAll()
    } catch {
      recordingsCache = []
    }
  }
  return recordingsCache!
}

async function findRecordingUrl(mundart: string): Promise<string | null> {
  const recordings = await ensureCache()
  const match = recordings.find(
    r => r.word_text?.toLowerCase() === mundart.toLowerCase()
  )
  return match ? api.audio.getDataUrl(match.id) : null
}

function playTTS(text: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      reject(new Error('Sprachausgabe nicht unterstützt'))
      return
    }
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'de-DE'
    utterance.rate = 0.8
    utterance.onend = () => resolve()
    utterance.onerror = () => reject(new Error('Sprachausgabe fehlgeschlagen'))
    speechSynthesis.speak(utterance)
  })
}

export function refreshAudioCache() {
  recordingsCache = null
}

export function stopAudio() {
  if (currentAudio) {
    currentAudio.pause()
    currentAudio = null
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel()
  }
}

export async function playWordAudio(
  mundart: string,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (err: Error) => void
) {
  stopAudio()
  onStart?.()

  try {
    const recordingUrl = await findRecordingUrl(mundart)

    if (recordingUrl) {
      const audio = new Audio(recordingUrl)
      currentAudio = audio
      audio.onended = () => { currentAudio = null; onEnd?.() }
      audio.onerror = () => {
        currentAudio = null
        playTTS(mundart).then(onEnd).catch(() => onEnd?.())
      }
      await audio.play()
    } else {
      await playTTS(mundart)
      onEnd?.()
    }
  } catch (err) {
    onError?.(err instanceof Error ? err : new Error(String(err)))
    onEnd?.()
  }
}
