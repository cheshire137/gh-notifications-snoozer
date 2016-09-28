const fs = require('fs')
const path = require('path')

const configPath = path.join('src', 'config.json')
console.log(`checking for ${configPath}...`)
fs.access(configPath, fs.F_OK, err => {
  if (err) {
    console.log(`copying config.json.example to ${configPath}`)
    fs.createReadStream('config.json.example').
       pipe(fs.createWriteStream(configPath))
  } else {
    console.log(`${configPath} already exists`)
  }
})
