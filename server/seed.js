import { saveDB } from './db.js'
import { fullWordList } from './wordList.js'

export async function seedWords(db) {
  const { v4: uuidv4 } = await import('uuid')

  const stmt = db.prepare(
    'INSERT INTO words (id, schriftdeutsch, mundart, bedeutung, sprecher, ort, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
  )

  const now = new Date().toISOString()

  for (const w of fullWordList) {
    stmt.run([uuidv4(), w.schriftdeutsch, w.mundart, w.bedeutung, w.sprecher, w.ort || 'Wenigumstadt', now])
  }

  saveDB()
  console.log(`Seeded ${fullWordList.length} words`)
}
