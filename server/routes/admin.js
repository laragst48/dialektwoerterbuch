import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'

const JWT_SECRET = 'dialekta-secret-key-2026'

function adminMiddleware(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ error: 'Nicht autorisiert.' })
  }

  try {
    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET)
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Nur für Administratoren.' })
    }
    req.user = decoded
    next()
  } catch {
    res.status(401).json({ error: 'Ungültiger Token.' })
  }
}

export const adminRouter = Router()
adminRouter.use(adminMiddleware)

adminRouter.post('/words', (req, res) => {
  const { schriftdeutsch, mundart, bedeutung, audioDatei, sprecher, ort, datum } = req.body

  if (!schriftdeutsch || !mundart) {
    return res.status(400).json({ error: 'Schriftdeutsch und Mundart sind erforderlich.' })
  }

  const db = req.db
  const id = uuidv4()
  const createdAt = new Date().toISOString()

  db.run(
    `INSERT INTO words (id, schriftdeutsch, mundart, bedeutung, audioDatei, sprecher, ort, datum, created_by, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, schriftdeutsch, mundart, bedeutung || '', audioDatei || '', sprecher || req.user.name, ort || 'Wenigumstadt', datum || '', req.user.id, createdAt]
  )
  req.saveDB()

  res.status(201).json({ id, message: 'Wort erstellt.' })
})

adminRouter.put('/words/:id', (req, res) => {
  const { schriftdeutsch, mundart, bedeutung, audioDatei, sprecher, ort, datum } = req.body

  const db = req.db
  const items = req.rowToObj(db.exec(`SELECT id FROM words WHERE id = '${req.params.id.replace(/'/g, "''")}'`))

  if (!items || items.length === 0) {
    return res.status(404).json({ error: 'Wort nicht gefunden.' })
  }

  db.run(
    `UPDATE words SET schriftdeutsch = ?, mundart = ?, bedeutung = ?, audioDatei = ?, sprecher = ?, ort = ?, datum = ? WHERE id = ?`,
    [schriftdeutsch || '', mundart || '', bedeutung || '', audioDatei || '', sprecher || '', ort || 'Wenigumstadt', datum || '', req.params.id]
  )
  req.saveDB()

  res.json({ message: 'Wort aktualisiert.' })
})

adminRouter.delete('/words/:id', (req, res) => {
  const db = req.db
  const items = req.rowToObj(db.exec(`SELECT id FROM words WHERE id = '${req.params.id.replace(/'/g, "''")}'`))

  if (!items || items.length === 0) {
    return res.status(404).json({ error: 'Wort nicht gefunden.' })
  }

  db.run('DELETE FROM words WHERE id = ?', [req.params.id])
  req.saveDB()

  res.json({ message: 'Wort gelöscht.' })
})

adminRouter.get('/users', (req, res) => {
  const db = req.db
  res.json(req.rowToObj(db.exec('SELECT id, email, name, role, created_at FROM users ORDER BY created_at DESC')))
})
