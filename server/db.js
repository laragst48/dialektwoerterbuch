import initSqlJs from 'sql.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_PATH = path.join(__dirname, 'dialekta.db')

let db = null

function rowToObj(result) {
  if (!result || result.length === 0) return null
  const columns = result[0].columns
  const rows = result[0].values
  return rows.map(row => {
    const obj = {}
    columns.forEach((col, i) => { obj[col] = row[i] })
    return obj
  })
}

export async function initDB() {
  const SQL = await initSqlJs()

  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH)
    db = new SQL.Database(buffer)
  } else {
    db = new SQL.Database()
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      created_at TEXT NOT NULL
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS words (
      id TEXT PRIMARY KEY,
      schriftdeutsch TEXT NOT NULL,
      mundart TEXT NOT NULL,
      bedeutung TEXT DEFAULT '',
      audioDatei TEXT DEFAULT '',
      sprecher TEXT DEFAULT '',
      ort TEXT DEFAULT 'Wenigumstadt',
      datum TEXT DEFAULT '',
      created_by TEXT,
      created_at TEXT NOT NULL
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS recordings (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      word_id TEXT,
      word_text TEXT NOT NULL,
      audio_data BLOB,
      created_at TEXT NOT NULL
    )
  `)

  saveDB()
  return { db, rowToObj }
}

export function saveDB() {
  if (db) {
    const data = db.export()
    const buffer = Buffer.from(data)
    fs.writeFileSync(DB_PATH, buffer)
  }
}

export function getDB() {
  return db
}
