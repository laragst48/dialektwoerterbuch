import React, { useState, useEffect } from 'react'
import { api } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import './AdminPage.css'

interface Word {
  id: string
  schriftdeutsch: string
  mundart: string
  bedeutung: string
  sprecher: string
  ort: string
}

interface User {
  id: string
  email: string
  name: string
  role: string
  created_at: string
}

interface AudioRec {
  id: string
  word_id: string
  word_text: string
  created_at: string
  schriftdeutsch: string
  mundart: string
}

function AdminPage() {
  const { user } = useAuth()
  const [words, setWords] = useState<Word[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [audioList, setAudioList] = useState<AudioRec[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [audioSearch, setAudioSearch] = useState('')

  const [addForm, setAddForm] = useState({ schriftdeutsch: '', mundart: '', bedeutung: '', sprecher: user?.name || '', ort: 'Wenigumstadt' })
  const [editForm, setEditForm] = useState({ schriftdeutsch: '', mundart: '', bedeutung: '', sprecher: user?.name || '', ort: 'Wenigumstadt' })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setError('')
    try {
      const [allWords, allUsers, allAudio] = await Promise.all([
        api.words.getAll(),
        api.admin.getUsers(),
        api.audio.getAll(),
      ])
      setWords(allWords)
      setUsers(allUsers)
      setAudioList(allAudio || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    if (!addForm.schriftdeutsch || !addForm.mundart) return
    setError('')
    try {
      await api.admin.createWord(addForm)
      setAddForm({ schriftdeutsch: '', mundart: '', bedeutung: '', sprecher: user?.name || '', ort: 'Wenigumstadt' })
      await loadData()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleUpdate = async (id: string) => {
    if (!editForm.schriftdeutsch || !editForm.mundart) return
    setError('')
    try {
      await api.admin.updateWord(id, editForm)
      setEditingId(null)
      await loadData()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Wirklich löschen?')) return
    setError('')
    try {
      await api.admin.deleteWord(id)
      await loadData()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const startEdit = (word: Word) => {
    setEditingId(word.id)
    setEditForm({
      schriftdeutsch: word.schriftdeutsch,
      mundart: word.mundart,
      bedeutung: word.bedeutung || '',
      sprecher: word.sprecher || user?.name || '',
      ort: word.ort || 'Wenigumstadt',
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  const deleteAudio = async (id: string) => {
    if (!confirm('Wirklich löschen?')) return
    try {
      await api.admin.deleteAudio(id)
      await loadData()
    } catch (err: any) { setError(err.message) }
  }

  if (loading) return <div className="page-loading">Lädt…</div>

  return (
    <div className="admin-page">
      <h1>Admin-Bereich</h1>
      {error && <p className="admin-error">{error}</p>}

      <section className="card admin-section">
        <h2>Wort hinzufügen</h2>
        <div className="admin-form">
          <input type="text" placeholder="Schriftdeutsch *" value={addForm.schriftdeutsch}
            onChange={e => setAddForm(f => ({ ...f, schriftdeutsch: e.target.value }))} />
          <input type="text" placeholder="Wenigumstädter Mundart *" value={addForm.mundart}
            onChange={e => setAddForm(f => ({ ...f, mundart: e.target.value }))} />
          <input type="text" placeholder="Bedeutung" value={addForm.bedeutung}
            onChange={e => setAddForm(f => ({ ...f, bedeutung: e.target.value }))} />
          <div className="admin-form-actions">
            <button className="btn btn-primary" onClick={handleCreate}>
              Hinzufügen
            </button>
          </div>
        </div>
      </section>

      <section className="card admin-section">
        <h2>Wörter ({words.length})</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Schriftdeutsch</th><th>Wenigumstädter<br />Mundart</th><th></th></tr>
            </thead>
            <tbody>
              {words.map(w => (
                <React.Fragment key={w.id}>
                <tr>
                  <td>{w.schriftdeutsch}</td>
                  <td>{w.mundart}</td>
                  <td className="admin-actions">
                    <button className="btn btn-sm btn-primary" onClick={() => startEdit(w)}>Bearbeiten</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(w.id)}>Löschen</button>
                  </td>
                </tr>
                {editingId === w.id && (
                  <tr className="inline-edit-row">
                    <td colSpan={3}>
                      <div className="inline-edit-form">
                        <input type="text" placeholder="Schriftdeutsch *" value={editForm.schriftdeutsch}
                          onChange={e => setEditForm(f => ({ ...f, schriftdeutsch: e.target.value }))} />
                        <input type="text" placeholder="Wenigumstädter Mundart *" value={editForm.mundart}
                          onChange={e => setEditForm(f => ({ ...f, mundart: e.target.value }))} />
                        <input type="text" placeholder="Bedeutung" value={editForm.bedeutung}
                          onChange={e => setEditForm(f => ({ ...f, bedeutung: e.target.value }))} />
                        <div className="admin-form-actions">
                          <button className="btn btn-primary" onClick={() => handleUpdate(w.id)}>Speichern</button>
                          <button className="btn btn-secondary" onClick={cancelEdit}>Abbrechen</button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card admin-section">
        <h2>Audio-Bibliothek ({audioList.length})</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Wort</th><th>Hochdeutsch</th><th>Datum</th><th></th></tr>
            </thead>
            <tbody>
              {audioList.map(a => (
                <tr key={a.id}>
                  <td><strong>{a.word_text || a.mundart}</strong></td>
                  <td>{a.schriftdeutsch || '–'}</td>
                  <td>{new Date(a.created_at).toLocaleDateString('de-DE')}</td>
                  <td className="admin-actions">
                    <button className="btn btn-sm" onClick={() => { const url = api.audio.getDataUrl(a.id); new Audio(url).play().catch(() => alert('Keine gültigen Audiodaten für diesen Eintrag.')) }}>▶</button>
                    <button className="btn btn-sm btn-danger" onClick={() => deleteAudio(a.id)}>Löschen</button>
                  </td>
                </tr>
              ))}
              {audioList.length === 0 && (
                <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-light)' }}>Keine Aufnahmen</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card admin-section">
        <h2>Benutzer ({users.length})</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Name</th><th>E-Mail</th><th>Rolle</th><th>Registriert</th></tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td className={u.role === 'admin' ? 'role-admin' : ''}>{u.role === 'admin' ? 'Admin' : 'Benutzer'}</td>
                  <td>{new Date(u.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default AdminPage
