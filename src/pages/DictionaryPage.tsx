import { useState, useMemo, useEffect } from 'react'
import { api } from '../services/api'
import { words as fallback } from '../data/words'
import './DictionaryPage.css'

interface WordEntry {
  id: string
  schriftdeutsch: string
  mundart: string
  bedeutung: string
}

function DictionaryPage() {
  const [allWords, setAllWords] = useState<WordEntry[]>(fallback)
  const [search, setSearch] = useState('')
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null)
  const [selectedWord, setSelectedWord] = useState<WordEntry | null>(null)

  useEffect(() => {
    api.words.getAll().then(d => { if (d?.length) setAllWords(d) }).catch(() => {})
  }, [])

  const letters = useMemo(() => {
    const set = new Set<string>()
    allWords.forEach((w) => {
      const first = w.mundart.charAt(0).toUpperCase()
      if (/^[A-ZÄÖÜ]$/.test(first)) set.add(first)
    })
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'de'))
  }, [allWords])

  const filtered = useMemo(() => {
    let list = allWords

    if (selectedLetter) {
      list = list.filter((w) => w.mundart.toUpperCase().startsWith(selectedLetter))
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim()
      list = list.filter(
        (w) =>
          w.mundart.toLowerCase().includes(q) ||
          w.schriftdeutsch.toLowerCase().includes(q) ||
          w.bedeutung.toLowerCase().includes(q)
      )
    }

    return list.sort((a, b) => a.mundart.localeCompare(b.mundart, 'de'))
  }, [search, selectedLetter, allWords])

  return (
    <div className="dictionary-page">
      <h1>Wörterbuch</h1>
      <p className="page-subtitle">
        Alle Dialektwörter von A bis Z. Wähl ein Wort aus, um die Übersetzung und Bedeutung zu sehen.
      </p>

      <div className="card">
        <div className="search-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Wort suchen…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setSelectedLetter(null)
            }}
          />
        </div>

        <div className="letter-nav">
          {letters.map((letter) => (
            <button
              key={letter}
              className={`letter-btn ${selectedLetter === letter ? 'active' : ''}`}
              onClick={() => {
                setSelectedLetter(selectedLetter === letter ? null : letter)
                setSearch('')
                setSelectedWord(null)
              }}
            >
              {letter}
            </button>
          ))}
          {selectedLetter && (
            <button className="letter-btn clear-btn" onClick={() => setSelectedLetter(null)}>
              Alle
            </button>
          )}
        </div>

        <p className="word-count">
          {filtered.length} Eintrag{filtered.length !== 1 ? 'e' : ''}
        </p>

        <div className="dictionary-layout">
          <div className="word-list">
            {filtered.map((word) => (
              <div
                key={word.id}
                className={`word-list-item ${selectedWord?.id === word.id ? 'selected' : ''}`}
                onClick={() => setSelectedWord(word)}
              >
                <span className="word-mundart">{word.mundart}</span>
                <span className="word-separator">—</span>
                <span className="word-schriftdeutsch">{word.schriftdeutsch}</span>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="no-words">
                Keine Wörter gefunden für "{search}"
              </div>
            )}
          </div>

          <div className="word-detail">
            {selectedWord ? (
              <div className="detail-content">
                <h2 className="detail-mundart">{selectedWord.mundart}</h2>
                <p className="detail-schriftdeutsch">
                  <strong>Hochdeutsch:</strong> {selectedWord.schriftdeutsch}
                </p>
                {selectedWord.bedeutung && selectedWord.bedeutung.toLowerCase().trim() !== selectedWord.schriftdeutsch.toLowerCase().trim() && (
                  <p className="detail-meaning">
                    <strong>Bedeutung:</strong> {selectedWord.bedeutung}
                  </p>
                )}
              </div>
            ) : (
              <div className="detail-empty">
                <p>Wähl links ein Wort aus, um die Details zu sehen.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DictionaryPage
