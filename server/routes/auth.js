import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { Router } from 'express'

const JWT_SECRET = 'dialekta-secret-key-2026'

export const authRouter = Router()

authRouter.post('/register', (req, res) => {
  const { email, password, name, adminCode } = req.body

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'E-Mail, Passwort und Name sind erforderlich.' })
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Passwort muss mindestens 6 Zeichen lang sein.' })
  }

  const db = req.db

  const existing = db.exec(`SELECT id FROM users WHERE email = '${email.replace(/'/g, "''")}'`)
  if (existing.length > 0 && existing[0].values.length > 0) {
    return res.status(409).json({ error: 'Diese E-Mail ist bereits registriert.' })
  }

  const hashedPassword = bcrypt.hashSync(password, 10)
  const id = uuidv4()
  const role = adminCode === 'ADMIN2026' ? 'admin' : 'user'
  const createdAt = new Date().toISOString()

  db.run(
    `INSERT INTO users (id, email, password, name, role, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
    [id, email, hashedPassword, name, role, createdAt]
  )
  req.saveDB()

  const token = jwt.sign({ id, email, role, name }, JWT_SECRET, { expiresIn: '7d' })

  res.status(201).json({
    token,
    user: { id, email, name, role }
  })
})

authRouter.post('/login', (req, res) => {
  const { name, password } = req.body

  if (!name || !password) {
    return res.status(400).json({ error: 'Benutzername und Passwort sind erforderlich.' })
  }

  const db = req.db
  const users = req.rowToObj(db.exec(`SELECT * FROM users WHERE name = '${name.replace(/'/g, "''")}'`))

  if (!users || users.length === 0) {
    return res.status(401).json({ error: 'Ungültiger Benutzername oder Passwort.' })
  }

  const user = users[0]

  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Ungültiger Benutzername oder Passwort.' })
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  )

  res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role }
  })
})

authRouter.get('/me', (req, res) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ error: 'Nicht autorisiert.' })
  }

  try {
    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET)
    res.json({ user: decoded })
  } catch {
    res.status(401).json({ error: 'Ungültiger Token.' })
  }
})
