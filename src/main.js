const { app, BrowserWindow, ipcMain } = require('electron')
const installExtension = require('electron-devtools-installer')

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
  const title = app.getName()
  mainWindow = new BrowserWindow({ width: 800, height: 600, title })
  mainWindow.loadURL(`file://${__dirname}/index.html`)
}

app.on('ready', () => {
  installExtension.default(installExtension.REACT_DEVELOPER_TOOLS)
    .then(name => console.log(`Added Extension:  ${name}`))
    .then(() => installExtension.default(installExtension.REDUX_DEVTOOLS)
    .then(name => console.log(`Added Extension:  ${name}`)))
    .catch(err => console.log('An error occurred: ', err))

  app.setAppUserModelId('com.gh-notifications-snoozer.app')

  createWindow()

  mainWindow.webContents.on('did-finish-load', () => {
    ipcMain.on('title', onTitleChange)
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
})

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
