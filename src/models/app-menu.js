'use strict'

const { remote, shell } = require('electron')
const { Menu, app } = remote
const EventEmitter = require('events')
const Config = require('../config.json')

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
      click() { shell.openExternal(Config.bugReportUrl) },
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

  buildOSXMenu() {
    this.template.push({
      label: app.getName(),
      submenu: [
        this.aboutOption,
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click() { app.quit() },
        },
      ],
    })
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
        {
          label: 'Exit',
          accelerator: 'Ctrl+Q',
          click() { app.quit() },
        },
      ],
    })
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
