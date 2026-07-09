import { useState, useEffect, useRef, useCallback } from 'react'
import { api } from '../services/api'
import { words as fallback } from '../data/words'
import { playWordAudio, stopAudio, refreshAudioCache } from '../services/audioPlayer'
import './TranslatePage.css'

interface WordEntry {
  id: string
  schriftdeutsch: string
  mundart: string
  bedeutung: string
}

type Direction = 'hochdeutsch-dialekt' | 'dialekt-hochdeutsch'

function TranslatePage() {
  const [allWords, setAllWords] = useState<WordEntry[]>(fallback)
  const [input, setInput] = useState('')
  const [direction, setDirection] = useState<Direction>('hochdeutsch-dialekt')
  const [results, setResults] = useState<WordEntry[]>([])
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [playingId, setPlayingId] = useState<string | null>(null)

  const [isListening, setIsListening] = useState(false)
  const [voiceText, setVoiceText] = useState('')
  const [voiceResults, setVoiceResults] = useState<WordEntry[]>([])
  const [showVoiceResults, setShowVoiceResults] = useState(false)
  const [voiceError, setVoiceError] = useState('')

  const inputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<any>(null)
  const finalTranscriptRef = useRef('')

  useEffect(() => {
    api.words.getAll().then(d => { if (d?.length) setAllWords(d) }).catch(() => {})
    refreshAudioCache()
  }, [])

  useEffect(() => {
    inputRef.current?.focus()
    return () => stopAudio()
  }, [])

  useEffect(() => {
    setupRecognition()
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort() } catch {}
      }
    }
  }, [])

  function setupRecognition() {
    const SpeechRecognitionCtor =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognitionCtor) return

    try {
      const recognition = new SpeechRecognitionCtor()
      recognition.lang = 'de-DE'
      recognition.continuous = true
      recognition.interimResults = true
      recognition.maxAlternatives = 3

      recognition.onresult = (event: any) => {
        let interim = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscriptRef.current += transcript
          } else {
            interim += transcript
          }
        }
        const displayText = finalTranscriptRef.current + interim
        setVoiceText(displayText)

        if (displayText.trim()) {
          const query = displayText.toLowerCase().trim()
          const matches = allWords.filter(
            (w) =>
              w.mundart.toLowerCase().includes(query) ||
              w.schriftdeutsch.toLowerCase().includes(query) ||
              w.bedeutung.toLowerCase().includes(query)
          )
          setVoiceResults(matches)
          setShowVoiceResults(true)
        }
      }

      recognition.onerror = (event: any) => {
        console.warn('SpeechRecognition error:', event.error)
        setIsListening(false)
        if (event.error === 'not-allowed') {
          setVoiceError('Mikrofon-Zugriff wurde verweigert. Bitte erlaube das Mikrofon in den Browser-Einstellungen (🔒 neben der Adressleiste → Mikrofon → "Erlauben").')
        }
      }

      recognition.onend = () => {
        setIsListening(false)
        const text = finalTranscriptRef.current
        finalTranscriptRef.current = ''
        if (text.trim()) {
          setInput(text.trim())
          doSearch(text.trim())
          inputRef.current?.focus()
        }
      }

      recognitionRef.current = recognition
    } catch (e) {
      console.warn('Failed to create SpeechRecognition:', e)
    }
  }

  const doSearch = useCallback((value: string) => {
    setSelectedIndex(null)
    if (!value.trim()) {
      setResults([])
      return
    }
    const query = value.toLowerCase().trim()
    const filtered = allWords.filter((w) => {
      if (direction === 'hochdeutsch-dialekt') {
        return w.schriftdeutsch.toLowerCase().includes(query)
      } else {
        return w.mundart.toLowerCase().includes(query)
      }
    })
    setResults(filtered)
  }, [direction])

  const handleSearch = (value: string) => {
    setInput(value)
    doSearch(value)
  }

  const startListening = () => {
    setVoiceError('')
    if (recognitionRef.current) {
      try {
        finalTranscriptRef.current = ''
        recognitionRef.current.start()
        setIsListening(true)
        setShowVoiceResults(false)
        setVoiceText('')
        setVoiceResults([])
      } catch {
        setIsListening(false)
        setVoiceError('Fehler beim Starten der Spracheingabe.')
      }
    } else {
      requestMicAndSetup()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop() } catch {}
    }
  }

  const toggleListening = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  function requestMicAndSetup() {
    const SpeechRecognitionCtor =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognitionCtor) {
      setVoiceError('Spracheingabe wird von deinem Browser nicht unterstützt. Bitte verwende Chrome.')
      return
    }
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        stream.getTracks().forEach(t => t.stop())
        setupRecognition()
        setVoiceError('')
        if (recognitionRef.current) {
          startListening()
        }
      })
      .catch(() => {
        setVoiceError('Mikrofon-Zugriff wurde verweigert. Bitte erlaube den Zugriff in den Browser-Einstellungen.')
      })
  }

  const toggleDirection = () => {
    setDirection((prev) => {
      const next = prev === 'hochdeutsch-dialekt' ? 'dialekt-hochdeutsch' : 'hochdeutsch-dialekt'
      return next
    })
    setInput('')
    setResults([])
    setSelectedIndex(null)
  }

  const playAudio = (word: WordEntry, e: React.MouseEvent) => {
    e.stopPropagation()
    playWordAudio(
      word.mundart,
      () => setPlayingId(word.id),
      () => setPlayingId(null),
      () => setPlayingId(null)
    )
  }

  return (
    <div className="translate-page">
      <h1>Übersetzen</h1>
      <p className="page-subtitle">
        Gib ein Wort oder einen Satz ein, um zwischen Hochdeutsch und Wenigumstädter Mundart zu übersetzen.
      </p>

      <div className="card">
        <div className="direction-toggle">
          <button
            className={`dir-btn ${direction === 'hochdeutsch-dialekt' ? 'active' : ''}`}
            onClick={() => direction !== 'hochdeutsch-dialekt' && toggleDirection()}
          >
            <span className="dir-label">Hochdeutsch</span>
            <span className="dir-arrow">→</span>
            <span className="dir-label">Wenigumstädter<br />Mundart</span>
          </button>
          <button className="swap-btn" onClick={toggleDirection} title="Richtung wechseln">⇄</button>
          <button
            className={`dir-btn ${direction === 'dialekt-hochdeutsch' ? 'active' : ''}`}
            onClick={() => direction !== 'dialekt-hochdeutsch' && toggleDirection()}
          >
            <span className="dir-label">Wenigumstädter<br />Mundart</span>
            <span className="dir-arrow">→</span>
            <span className="dir-label">Hochdeutsch</span>
          </button>
        </div>

        <div className="search-container">
          <span className="search-icon">🔍</span>
          <input
            ref={inputRef}
            type="text"
            placeholder={direction === 'hochdeutsch-dialekt' ? 'Hochdeutsches Wort eingeben…' : 'Wenigumstädter Wort eingeben…'}
            value={input}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        {results.length > 0 && (
          <div className="translate-results">
            <p className="result-count">{results.length} Treffer</p>
            {results.slice(0, 15).map((word, idx) => (
              <div
                key={word.id}
                className={`translate-result-item ${selectedIndex === idx ? 'selected' : ''}`}
                onClick={() => setSelectedIndex(idx)}
              >
                <div className="result-row">
                  <div className="result-pair">
                    <span className="result-source">
                      {direction === 'hochdeutsch-dialekt' ? word.schriftdeutsch : word.mundart}
                    </span>
                    <span className="result-arrow">→</span>
                    <span className="result-target">
                      {direction === 'hochdeutsch-dialekt' ? word.mundart : word.schriftdeutsch}
                    </span>
                  </div>
                  <button
                    className={`play-result-btn ${playingId === word.id ? 'playing' : ''}`}
                    onClick={(e) => playAudio(word, e)}
                    title="Aussprache anhören"
                  >
                    {playingId === word.id ? '⟳' : '▶'}
                  </button>
                </div>
                {word.bedeutung && (
                  <p className="result-meaning">{word.bedeutung}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {input.trim() && results.length === 0 && (
          <div className="no-results">
            <p>Keine Übersetzung gefunden für: <strong>"{input}"</strong></p>
            <p className="hint">Versuchs mit einem anderen Wort oder überprüf die Schreibweise.</p>
          </div>
        )}

        {!input.trim() && (
          <div className="translate-placeholder">
            <p>👆 Gib oben ein Wort ein, um die Übersetzung zu sehen.</p>
          </div>
        )}
      </div>

      <div className="card voice-card">
        <h2>Spracheingabe</h2>
        <p>Sprich ein Wort oder einen ganzen Satz – die App erkennt es und sucht nach der Übersetzung.</p>

        <div className="voice-input-area">
          <button
            className={`voice-btn ${isListening ? 'listening' : ''}`}
            onClick={toggleListening}
            title={isListening ? 'Spracheingabe stoppen' : 'Spracheingabe starten'}
          >
            <span className="mic-icon">{isListening ? '🔴' : '🎤'}</span>
            <span>{isListening ? 'Höre zu…' : 'Spracheingabe starten'}</span>
          </button>

          {isListening && (
            <div className="voice-live-text">
              <span className="voice-live-dot" />
              <span>{voiceText || 'Warte auf Spracheingabe…'}</span>
            </div>
          )}

          {voiceError && (
            <p className="voice-error-box">{voiceError}</p>
          )}
        </div>

        {showVoiceResults && voiceResults.length > 0 && (
          <div className="voice-matches">
            <p className="voice-matches-title">Gefundene Treffer:</p>
            {voiceResults.slice(0, 8).map((w) => (
              <div key={w.id} className="voice-match-item">
                <div className="result-pair">
                  <span className="result-source">{w.schriftdeutsch}</span>
                  <span className="result-arrow">→</span>
                  <span className="result-target">{w.mundart}</span>
                </div>
                <button className="play-btn-small" onClick={(e) => playAudio(w, e)}>▶</button>
              </div>
            ))}
          </div>
        )}

        {!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) && (
          <div className="voice-unavailable">
            <p>Spracheingabe wird in deinem Browser nicht unterstützt.</p>
            <p className="voice-hint">Bitte öffne die App in <strong>Google Chrome</strong> und erlaube den Mikrofon-Zugriff.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TranslatePage
