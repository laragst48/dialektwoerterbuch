import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { initDB, saveDB } from './db.js'
import { authRouter } from './routes/auth.js'
import { wordsRouter } from './routes/words.js'
import { adminRouter } from './routes/admin.js'
import { audioRouter, adminAudioRouter } from './routes/audio.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json({ limit: '50mb' }))

const { db, rowToObj } = await initDB()

app.use((req, res, next) => {
  req.db = db
  req.rowToObj = rowToObj
  req.saveDB = saveDB
  next()
})

app.use('/api/auth', authRouter)
app.use('/api/audio', audioRouter)
app.use('/api/words', wordsRouter)
app.use('/api/admin', adminRouter)
app.use('/api/admin/audio', adminAudioRouter)

// Seed words if empty
const count = db.exec('SELECT COUNT(*) as cnt FROM words')
if (!count[0]?.values[0]?.[0]) {
  const { seedWords } = await import('./seed.js')
  await seedWords(db)
}

// Serve built frontend in production
const distPath = path.join(__dirname, '..', 'dist')
app.use(express.static(distPath))
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) return
  res.sendFile(path.join(distPath, 'index.html'))
})

app.use((err, req, res, next) => {
  console.error('Server error:', err)
  res.status(500).json({ error: 'Interner Serverfehler.' })
})

app.listen(PORT, () => {
  console.log(`Dialekta running on http://localhost:${PORT}`)
})
