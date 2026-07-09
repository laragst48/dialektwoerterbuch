import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'

const JWT_SECRET = 'dialekta-secret-key-2026'

function adminMiddleware(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).json({ error: 'Nicht autorisiert.' })
  try {
    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET)
    if (decoded.role !== 'admin') return res.status(403).json({ error: 'Nur für Administratoren.' })
    req.user = decoded
    next()
  } catch {
    res.status(401).json({ error: 'Ungültiger Token.' })
  }
}

export const audioRouter = Router()

audioRouter.get('/', (req, res) => {
  const db = req.db
  const search = req.query.search || ''
  let sql = `SELECT r.id, r.word_id, r.word_text, r.user_id as uploaded_by, r.created_at, w.schriftdeutsch, w.mundart FROM recordings r LEFT JOIN words w ON r.word_id = w.id`
  if (search.trim()) {
    const q = search.replace(/'/g, "''")
    sql += ` WHERE r.word_text LIKE '%${q}%' OR w.schriftdeutsch LIKE '%${q}%' OR w.mundart LIKE '%${q}%'`
  }
  sql += ' ORDER BY r.created_at DESC'
  res.json(req.rowToObj(db.exec(sql)) || [])
})

audioRouter.get('/:id', (req, res) => {
  const db = req.db
  const items = req.rowToObj(db.exec(`SELECT r.id, r.word_id, r.word_text, r.user_id as uploaded_by, r.created_at, w.schriftdeutsch, w.mundart FROM recordings r LEFT JOIN words w ON r.word_id = w.id WHERE r.id = '${req.params.id.replace(/'/g, "''")}'`))
  if (!items || items.length === 0) return res.status(404).json({ error: 'Aufnahme nicht gefunden.' })
  res.json(items[0])
})

audioRouter.get('/:id/data', (req, res) => {
  const db = req.db
  const items = req.rowToObj(db.exec(`SELECT id, audio_data FROM recordings WHERE id = '${req.params.id.replace(/'/g, "''")}'`))
  if (!items || items.length === 0) return res.status(404).json({ error: 'Aufnahme nicht gefunden.' })
  const record = items[0]
  if (!record.audio_data) return res.status(404).json({ error: 'Keine Audiodaten vorhanden.' })
  const buf = Buffer.from(record.audio_data)
  res.set('Content-Type', 'audio/webm')
  res.set('Content-Length', buf.length.toString())
  res.send(buf)
})

export const adminAudioRouter = Router()
adminAudioRouter.use(adminMiddleware)

adminAudioRouter.post('/', (req, res) => {
  const { word_id, word_text, audio_base64 } = req.body
  if (!word_id || !word_text || !audio_base64) {
    return res.status(400).json({ error: 'word_id, word_text und audio_base64 sind erforderlich.' })
  }
  const db = req.db
  const id = uuidv4()
  const audioBuf = new Uint8Array(Buffer.from(audio_base64, 'base64'))
  const createdAt = new Date().toISOString()
  db.run(`INSERT INTO recordings (id, user_id, word_id, word_text, audio_data, created_at) VALUES (?, ?, ?, ?, ?, ?)`, [id, req.user.id, word_id, word_text, audioBuf, createdAt])
  req.saveDB()
  res.status(201).json({ id, word_id, word_text, message: 'Audioaufnahme gespeichert.' })
})

adminAudioRouter.delete('/:id', (req, res) => {
  const db = req.db
  const items = req.rowToObj(db.exec(`SELECT id FROM recordings WHERE id = '${req.params.id.replace(/'/g, "''")}'`))
  if (!items || items.length === 0) return res.status(404).json({ error: 'Aufnahme nicht gefunden.' })
  db.run(`DELETE FROM recordings WHERE id = ?`, [req.params.id])
  req.saveDB()
  res.json({ message: 'Aufnahme gelöscht.' })
})
