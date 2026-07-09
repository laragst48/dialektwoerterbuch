import { initDB, saveDB } from '../server/db.js'
import { v4 as uuidv4 } from 'uuid'
import { fullWordList } from '../server/wordList.js'

const { db, rowToObj } = await initDB()
const existing = rowToObj(db.exec('SELECT mundart, schriftdeutsch FROM words'))
const existingSet = new Set(existing.map(r => `${r.mundart}|${r.schriftdeutsch}`))

let added = 0
const now = new Date().toISOString()

for (const w of fullWordList) {
  const key = `${w.mundart}|${w.schriftdeutsch}`
  if (!existingSet.has(key)) {
    db.run(
      `INSERT INTO words (id, schriftdeutsch, mundart, bedeutung, sprecher, ort, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [uuidv4(), w.schriftdeutsch, w.mundart, w.bedeutung, w.sprecher || '', w.ort || 'Wenigumstadt', now]
    )
    added++
  }
}

saveDB()
console.log(`Sync: ${added} neue Wörter hinzugefügt, ${existing.length} bereits vorhanden. Gesamt: ${existing.length + added}`)
