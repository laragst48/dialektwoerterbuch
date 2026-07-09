import { Router } from 'express'

export const wordsRouter = Router()

wordsRouter.get('/', (req, res) => {
  const db = req.db
  res.json(req.rowToObj(db.exec('SELECT * FROM words ORDER BY schriftdeutsch ASC')))
})

wordsRouter.get('/:id', (req, res) => {
  const db = req.db
  const items = req.rowToObj(db.exec(`SELECT * FROM words WHERE id = '${req.params.id.replace(/'/g, "''")}'`))

  if (!items || items.length === 0) {
    return res.status(404).json({ error: 'Wort nicht gefunden.' })
  }

  res.json(items[0])
})
