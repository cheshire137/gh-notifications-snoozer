'use strict'

const { remote, shell } = require('electron')
const { Menu, app } = remote
const EventEmitter = require('events')
const path = require('path')
const packagePath = path.join(__dirname, '..', '..', 'package.json')
const packageInfo = require(packagePath)

class AppMenu extends EventEmitter {
  constructor(options) {
    super()
    this.options = options
    this.template = []
    this.altOrOption = process.platform === 'darwin' ? 'Option' : 'Alt'
    const self = this
    this.aboutOption = {
      label: `About ${app.getName()}`,
      click() { self.emit('about-app') },
    }
    this.bugReportOption = {
      label: 'Report a bug',
      click() { shell.openExternal(packageInfo.bugs.url) },
    }
    this.buildMenu()
    this.menu = Menu.buildFromTemplate(this.template)
    Menu.setApplicationMenu(this.menu)
  }

  buildMenu() {
    if (process.platform === 'darwin') {
      this.buildOSXMenu()
    } else {
      this.buildNonOSXMenu()
    }
  }

  getEditMenu() {
    return {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
        { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
        { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
        { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
        {
          label: 'Select All',
          accelerator: 'CmdOrCtrl+A',
          selector: 'selectAll:',
        },
      ],
    }
  }

  setIsAuthenticated(isAuthenticated) {
    this.options = this.options || {}
    this.options.isAuthenticated = isAuthenticated
    const viewMenu = this.menu.items[2].submenu
    viewMenu.items[0].enabled = isAuthenticated // Tasks
    viewMenu.items[1].enabled = isAuthenticated // Filters
  }

  toggleTaskOptions(enabled, type) {
    const taskMenu = this.menu.items[3].submenu
    if (type === 'restore') {
      taskMenu.items[0].enabled = false // Archive
      taskMenu.items[1].enabled = false // Snooze
      taskMenu.items[2].enabled = false // Ignore
      taskMenu.items[3].enabled = enabled // Restore
    } else {
      taskMenu.items[0].enabled = enabled // Archive
      taskMenu.items[1].enabled = enabled // Snooze
      taskMenu.items[2].enabled = enabled // Ignore
      taskMenu.items[3].enabled = false // Restore
    }
  }

  getViewMenu() {
    const self = this
    return {
      label: 'View',
      submenu: [
        {
          label: 'Tasks',
          accelerator: 'CmdOrCtrl+1',
          click() { self.emit('tasks') },
          enabled: this.options.isAuthenticated,
        },
        {
          label: 'Filters',
          accelerator: 'CmdOrCtrl+2',
          click() { self.emit('filters') },
          enabled: this.options.isAuthenticated,
        },
        {
          label: 'Authentication',
          accelerator: 'CmdOrCtrl+3',
          click() { self.emit('authenticate') },
        },
      ],
    }
  }

  getToolsMenu() {
    return {
      label: 'Tools',
      submenu: [
        {
          label: 'Developer Tools',
          accelerator: `CmdOrCtrl+${this.altOrOption}+I`,
          click(item, win) {
            if (win) {
              win.webContents.toggleDevTools()
            }
          },
        },
      ],
    }
  }

  getAppMenu() {
    return {
      label: app.getName(),
      submenu: [
        this.aboutOption,
        // { label: 'About', selector: 'orderFrontStandardAboutPanel:' },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click() { app.quit() },
        },
      ],
    }
  }

  buildOSXMenu() {
    this.template.push(this.getAppMenu())
    this.template.push(this.getEditMenu())
    this.template.push(this.getViewMenu())
    this.template.push(this.getTaskMenu())
    this.template.push(this.getToolsMenu())
    this.template.push({
      label: 'Help',
      role: 'help',
      submenu: [
        this.bugReportOption,
      ],
    })
  }

  getFileMenu() {
    return {
      label: 'File',
      submenu: [
        {
          label: 'Exit',
          accelerator: 'Ctrl+Q',
          click() { app.quit() },
        },
      ],
    }
  }

  getTaskMenu() {
    const self = this
    return {
      label: 'Task',
      submenu: [
        {
          label: 'Archive',
          accelerator: `Ctrl+${this.altOrOption}+A`,
          click() { self.emit('archive') },
          enabled: false,
        },
        {
          label: 'Snooze',
          accelerator: `Ctrl+${this.altOrOption}+S`,
          click() { self.emit('snooze') },
          enabled: false,
        },
        {
          label: 'Ignore',
          accelerator: `Ctrl+${this.altOrOption}+I`,
          click() { self.emit('ignore') },
          enabled: false,
        },
        {
          label: 'Restore',
          accelerator: `Ctrl+${this.altOrOption}+R`,
          click() { self.emit('restore') },
          enabled: false,
        },
      ],
    }
  }

  buildNonOSXMenu() {
    this.template.push(this.getFileMenu())
    this.template.push(this.getEditMenu())
    this.template.push(this.getViewMenu())
    this.template.push(this.getTaskMenu())
    this.template.push(this.getToolsMenu())
    this.template.push({
      label: 'Help',
      submenu: [
        this.aboutOption,
        this.bugReportOption,
      ],
    })
  }
}

module.exports = AppMenu
