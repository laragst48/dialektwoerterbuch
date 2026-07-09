const fs = require('fs')
let text = fs.readFileSync('src/data/words.ts', 'utf8')

// Also fix the server word list
let serverText = fs.readFileSync('server/wordList.js', 'utf8')
serverText = serverText.replace(
  /"schriftdeutsch":"([^"]*)","mundart":"([^"]*)","bedeutung":"\1"/gi,
  '"schriftdeutsch":"$1","mundart":"$2","bedeutung":""'
)
fs.writeFileSync('server/wordList.js', serverText)

// Replace bedeutung with empty string when it matches schriftdeutsch (case-insensitive)
text = text.replace(
  /"schriftdeutsch":"([^"]*)","mundart":"([^"]*)","bedeutung":"\1"/gi,
  '"schriftdeutsch":"$1","mundart":"$2","bedeutung":""'
)

fs.writeFileSync('src/data/words.ts', text)
console.log('Fixed duplicate bedeutung entries')
