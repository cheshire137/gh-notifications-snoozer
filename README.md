# gh-notifications-snoozer

[![Build status](https://travis-ci.org/cheshire137/gh-notifications-snoozer.svg?branch=master)](https://travis-ci.org/cheshire137/gh-notifications-snoozer)

Lists and filters and snoozing pull requests, oh my! This is an app for managing
your notifications on GitHub by way of filtering issues and pull requests that are
of interest to you.

![Screenshot](https://raw.githubusercontent.com/cheshire137/gh-notifications-snoozer/fa8024126b53358ca626d5b43afeceab0b0de252/screenshot1.png)

You must provide a GitHub personal access token once you start the app the first
time. [Create a token](https://github.com/settings/tokens/new) with the `repo`
scope. When running the app, your token will be stored in Keychain in macOS,
Gnome Keyring in Linux, and Credential Vault in Windows.

## How to Develop

This was developed with npm version 3.10.3 and node version 6.3.1.

### First-time Setup

In Linux, you may need to run

```bash
sudo apt-get install libgnome-keyring-dev
```

first because this app uses gnome-keyring. Afterward, including for macOS and
Windows:

```bash
# Clone this repository
git clone https://github.com/cheshire137/gh-notifications-snoozer
# Go into the repository
cd gh-notifications-snoozer
# Install dependencies
npm install
```

### Every Time

Run the app with:

```bash
npm start
```

### Troubleshooting

> When I run `npm start`, I get "Error: Module version mismatch. Expected 49, got 48" in the JavaScript console.

Exit the app and try running:

```bash
./node_modules/.bin/electron-rebuild
```

Then run `npm start` again and see if the app loads.

## How to Run Tests

How you set the `NODE_ENV` environment variable to run `npm test` may be different depending on your operating system and shell.

```bash
npm install
NODE_ENV=test npm test
```

You can run just the style checker by itself with `npm run style`. You can run just the tests by themselves with `NODE_ENV=test npm run unit-tests`.

## How to Build the App

### macOS

```bash
npm install
npm run build-macos
```

The directory dist/GHSnooze-darwin-x64/ will be created with a GHSnooze.app file inside that you can double-click to run.

### Windows

```bash
npm install
npm run build-windows
```

### Linux

```bash
npm install
npm run build-linux
```
