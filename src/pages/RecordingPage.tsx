import { useState, useRef, useEffect, useCallback } from 'react'
import { api } from '../services/api'
import { words as fallback } from '../data/words'
import { useAuth } from '../contexts/AuthContext'
import { saveRecording, getAllRecordings, deleteRecording, type SavedRecording } from '../services/recordingsDB'
import './RecordingPage.css'

interface WordEntry {
  id: string
  schriftdeutsch: string
  mundart: string
  bedeutung: string
}

interface ServerRecording {
  id: string
  word_id: string
  word_text: string
  uploaded_by: string
  created_at: string
  schriftdeutsch: string
  mundart: string
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function RecordingPage() {
  const { user, isAdmin } = useAuth()
  const [allWords, setAllWords] = useState<WordEntry[]>(fallback)
  const [serverRecordings, setServerRecordings] = useState<ServerRecording[]>([])
  const [localRecordings, setLocalRecordings] = useState<SavedRecording[]>([])
  const [search, setSearch] = useState('')
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [isRecording, setIsRecording] = useState(false)
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
  const [recordedDuration, setRecordedDuration] = useState(0)
  const [recordingTime, setRecordingTime] = useState(0)
  const [word, setWord] = useState('')
  const [speaker, setSpeaker] = useState('')
  const [saving, setSaving] = useState(false)
  const [suggestions, setSuggestions] = useState<WordEntry[]>([])
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const loadServerRecordings = useCallback(async () => {
    try {
      const [audio, wordData] = await Promise.all([
        api.audio.getAll(search || undefined),
        api.words.getAll()
      ])
      setServerRecordings(audio || [])
      if (wordData?.length) setAllWords(wordData)
    } catch {
      setError('Fehler beim Laden der Aufnahmen.')
    }
  }, [search])

  const loadLocalRecordings = useCallback(async () => {
    const all = await getAllRecordings()
    const filtered = user ? all.filter(r => r.userId === user.id) : []
    filtered.sort((a, b) => b.date.localeCompare(a.date))
    setLocalRecordings(filtered)
  }, [user])

  useEffect(() => {
    setLoading(true)
    Promise.all([loadServerRecordings(), loadLocalRecordings()]).finally(() => setLoading(false))
  }, [loadServerRecordings, loadLocalRecordings])

  const playServerAudio = (r: ServerRecording) => {
    setPlayingId(r.id)
    const url = api.audio.getDataUrl(r.id)
    const audio = new Audio(url)
    audioRef.current = audio
    audio.onended = () => setPlayingId(null)
    audio.play().catch(() => setPlayingId(null))
  }

  const playLocalAudio = (r: SavedRecording) => {
    setPlayingId(r.id)
    const blob = new Blob([r.audioData], { type: 'audio/webm' })
    const url = URL.createObjectURL(blob)
    const audio = new Audio(url)
    audioRef.current = audio
    audio.onended = () => { setPlayingId(null); URL.revokeObjectURL(url) }
    audio.play().catch(() => { setPlayingId(null); URL.revokeObjectURL(url) })
  }

  const deleteLocalRecording = async (r: SavedRecording) => {
    await deleteRecording(r.id)
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null }
    setPlayingId(null)
    await loadLocalRecordings()
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []
      mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setRecordedBlob(blob)
        setRecordedDuration(recordingTime)
        setRecordingTime(0)
        if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
        if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null }
      }
      mediaRecorder.start(250)
      setIsRecording(true)
      const startTime = Date.now()
      timerRef.current = setInterval(() => setRecordingTime(Math.floor((Date.now() - startTime) / 1000)), 200)
    } catch (err) {
      if (err instanceof DOMException && err.name === 'NotAllowedError') {
        alert('Mikrofon-Zugriff wurde verweigert. Bitte erlaube das Mikrofon in den Browser-Einstellungen (🔒 neben der Adressleiste → Mikrofon → "Erlauben").')
      } else if (err instanceof DOMException && err.name === 'NotFoundError') {
        alert('Kein Mikrofon gefunden. Bitte schließ ein Mikrofon an.')
      } else {
        alert('Mikrofon-Fehler: ' + (err instanceof Error ? err.message : 'Unbekannter Fehler'))
      }
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const discardRecording = () => { setRecordedBlob(null); setRecordedDuration(0); setSelectedWordId(null) }

  const handleSaveLocal = async () => {
    if (!recordedBlob || !word.trim()) return
    setSaving(true)
    try {
      const audioData = await recordedBlob.arrayBuffer()
      await saveRecording({
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        word: word.trim(),
        speaker: speaker.trim() || 'Unbekannt',
        date: new Date().toISOString(),
        duration: recordedDuration,
        audioData,
        userId: user?.id,
      })
      setRecordedBlob(null)
      setRecordedDuration(0)
      setWord('')
      setSpeaker('')
      await loadLocalRecordings()
    } finally { setSaving(false) }
  }

  const handleSaveServer = async () => {
    if (!recordedBlob || !word.trim() || !isAdmin) return
    setSaving(true)
    try {
      const base64 = await blobToBase64(recordedBlob)
      let wordId = selectedWordId
      if (!wordId) {
        const match = allWords.find(w => w.mundart.toLowerCase() === word.trim().toLowerCase())
        if (match) wordId = match.id
      }
      if (!wordId) {
        setError('Kein passendes Wort gefunden. Bitte wähle ein Wort aus der Vorschlagsliste.')
        setSaving(false)
        return
      }
      await api.admin.uploadAudio(wordId, word.trim(), base64)
      setRecordedBlob(null)
      setRecordedDuration(0)
      setWord('')
      setSelectedWordId(null)
      await loadServerRecordings()
    } catch (err: any) {
      setError(err.message)
    } finally { setSaving(false) }
  }

  function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        resolve(result.split(',')[1])
      }
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }

  const handleWordChange = (value: string) => {
    setWord(value)
    if (value.trim()) {
      const q = value.toLowerCase()
      setSuggestions(allWords.filter(w => w.mundart.toLowerCase().includes(q) || w.schriftdeutsch.toLowerCase().includes(q)).slice(0, 6))
    } else {
      setSuggestions([])
      setSelectedWordId(null)
    }
  }

  const selectSuggestion = (w: WordEntry) => {
    setWord(w.mundart)
    setSelectedWordId(w.id)
    setSuggestions([])
  }

  const searchSuggestions = (value: string) => {
    setSearch(value)
  }

  if (loading) return <div className="page-loading">Lädt…</div>

  return (
    <div className="recording-page">
      <h1>Audio-Bibliothek</h1>
      <p className="page-subtitle">
        Alle offiziellen Audioaufnahmen der Wenigumstädter Mundart.
      </p>

      <div className="card">
        <div className="search-container">
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="Nach Wörtern oder Dialekten suchen…" value={search} onChange={e => searchSuggestions(e.target.value)} />
        </div>

        {serverRecordings.length === 0 && !search && (
          <div className="no-recordings"><p>Noch keine offiziellen Audioaufnahmen vorhanden.</p></div>
        )}

        {serverRecordings.length === 0 && search && (
          <div className="no-recordings"><p>Keine Aufnahmen gefunden für "{search}".</p></div>
        )}

        <div className="recordings-list">
          {serverRecordings.map(r => (
            <div key={r.id} className="recording-item">
              <div className="recording-info">
                <span className="rec-word">{r.word_text || r.mundart || r.schriftdeutsch}</span>
                {r.schriftdeutsch && <span className="rec-schrift">({r.schriftdeutsch})</span>}
                <span className="rec-date">{new Date(r.created_at).toLocaleDateString('de-DE')}</span>
              </div>
              <div className="recording-actions">
                <button className={`play-rec-btn ${playingId === r.id ? 'playing' : ''}`} onClick={() => playServerAudio(r)}>
                  {playingId === r.id ? '⏹' : '▶'} {playingId === r.id ? 'Stopp' : 'Abspielen'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {localRecordings.length > 0 && (
        <div className="card">
          <h2>Eigene Aufnahmen ({localRecordings.length})</h2>
          <div className="recordings-list">
            {localRecordings.map(r => (
              <div key={r.id} className="recording-item">
                <div className="recording-info">
                  <span className="rec-word">{r.word}</span>
                  <span className="rec-speaker">{r.speaker}</span>
                  <span className="rec-date">{new Date(r.date).toLocaleDateString('de-DE')}</span>
                  <span className="rec-duration">{formatTime(r.duration)}</span>
                </div>
                <div className="recording-actions">
                  <button className="play-rec-btn" onClick={() => playLocalAudio(r)} disabled={playingId === r.id}>
                    {playingId === r.id ? '▶ Wiedergabe…' : '▶ Abspielen'}
                  </button>
                  <button className="delete-rec-btn" onClick={() => deleteLocalRecording(r)}>✕</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card recording-card">
        <h2>Neue Aufnahme {isAdmin ? '(als Admin)' : '(lokal)'}</h2>

        {!recordedBlob && (
          <div className="recorder-ui">
            {!isRecording ? (
              <button className="record-btn-start" onClick={startRecording}>
                <span className="record-icon">●</span>
                <span>Aufnahme starten</span>
              </button>
            ) : (
              <div className="recording-active">
                <div className="recording-indicator">
                  <span className="rec-dot" />
                  <span className="rec-time">{formatTime(recordingTime)}</span>
                </div>
                <button className="record-btn-stop" onClick={stopRecording}>■ Stoppen</button>
              </div>
            )}
          </div>
        )}

        {recordedBlob && (
          <div className="recorded-preview">
            <div className="preview-header">
              <span className="preview-icon">✓</span>
              <span>Aufnahme beendet ({formatTime(recordedDuration)})</span>
            </div>
            <audio src={URL.createObjectURL(recordedBlob)} controls className="preview-audio" />
            <div className="preview-form">
              <label className="preview-label">
                Wort / Begriff
                <input type="text" value={word} onChange={e => handleWordChange(e.target.value)} placeholder="z. B. Aach" list="word-suggestions" />
                {suggestions.length > 0 && (
                  <div className="word-suggestions">
                    {suggestions.map(w => (
                      <button key={w.id} className="suggestion-item" onClick={() => selectSuggestion(w)}>
                        <span className="sug-mundart">{w.mundart}</span>
                        <span className="sug-schrift">→ {w.schriftdeutsch}</span>
                      </button>
                    ))}
                  </div>
                )}
              </label>
              {isAdmin && <p className="save-hint">Wird als offizielle Aufnahme gespeichert.</p>}
              {!isAdmin && (
                <label className="preview-label">
                  Dein Name (optional)
                  <input type="text" value={speaker} onChange={e => setSpeaker(e.target.value)} placeholder="z. B. Maria Huber" />
                </label>
              )}
              {error && <p className="recording-error">{error}</p>}
              <div className="preview-actions">
                <button className="secondary" onClick={discardRecording}>Verwerfen</button>
                {isAdmin ? (
                  <button onClick={handleSaveServer} disabled={!word.trim() || saving}>
                    {saving ? 'Speichern…' : 'Als offizielle Aufnahme speichern'}
                  </button>
                ) : (
                  <button onClick={handleSaveLocal} disabled={!word.trim() || saving}>
                    {saving ? 'Speichern…' : 'Lokal speichern'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RecordingPage
