const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const path = require('path')
const packageInfo = require(path.join(__dirname, '..', 'package.json'))

let mainWindow

function onTitleChange(event, prefix) {
  let title = ''
  if (typeof prefix === 'string' && prefix.length > 0) {
    title += `${prefix} - `
  }
  title += packageInfo.productName
  mainWindow.setTitle(title)
}

function createWindow() {
  app.setName('')
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: packageInfo.productName,
  })
  mainWindow.loadURL(`file://${__dirname}/index.html`)

  // mainWindow.webContents.openDevTools()

  mainWindow.webContents.on('did-finish-load', () => {
    electron.ipcMain.on('title', onTitleChange)
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
