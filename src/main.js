const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

let mainWindow

function onTitleChange(event, prefix) {
  let title = ''
  if (typeof prefix === 'string' && prefix.length > 0) {
    title += `${prefix} - `
  }
  title += app.getName()
  mainWindow.setTitle(title)
}

function createWindow() {
  app.setName('')
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: app.getName(),
  })
  mainWindow.loadURL(`file://${__dirname}/index.html`)


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
