'use strict'

const { remote, shell } = require('electron')
const { Menu, app } = remote
const EventEmitter = require('events')
const path = require('path')
const packagePath = path.join(__dirname, '..', '..', 'package.json')
const packageInfo = require(packagePath)

class AppMenu extends EventEmitter {
  constructor() {
    super()
    this.template = []
    const self = this
    this.aboutOption = {
      label: `About ${app.getName()}`,
      click() { self.emit('about-app') },
    }
    this.bugReportOption = {
      label: 'Report a bug',
      click() { shell.openExternal(packageInfo.bugs.url) },
    }
    this.authOption = {
      label: 'Authenticate',
      click() { self.emit('authenticate') },
    }
    this.buildMenu()
    Menu.setApplicationMenu(Menu.buildFromTemplate(this.template))
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

  buildOSXMenu() {
    this.template.push({
      label: app.getName(),
      submenu: [
        this.aboutOption,
        // { label: 'About', selector: 'orderFrontStandardAboutPanel:' },
        this.authOption,
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click() { app.quit() },
        },
      ],
    })
    this.template.push(this.getEditMenu())
    this.template.push({
      label: 'Help',
      role: 'help',
      submenu: [
        this.bugReportOption,
      ],
    })
  }

  buildNonOSXMenu() {
    this.template.push({
      label: 'File',
      submenu: [
        this.authOption,
        {
          label: 'Exit',
          accelerator: 'Ctrl+Q',
          click() { app.quit() },
        },
      ],
    })
    this.template.push(this.getEditMenu())
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
