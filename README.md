# gh-notifications-snoozer

[![Build status](https://travis-ci.org/cheshire137/gh-notifications-snoozer.svg?branch=master)](https://travis-ci.org/cheshire137/gh-notifications-snoozer)

Lists and filters and snoozing pull requests, oh my! This is an app for managing
your GitHub notifications by way of filtering issues and pull requests that are
of interest to you.

![Screenshot](https://raw.githubusercontent.com/cheshire137/gh-notifications-snoozer/fa8024126b53358ca626d5b43afeceab0b0de252/screenshot1.png)

You must provide a GitHub personal access token once you start the app the first
time. [Create a token](https://github.com/settings/tokens/new) with the `repo`
scope.

## How to Develop

### First-time Setup

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

## How to Run Tests

```bash
npm install
npm test
```

You can run just the style checker by itself with `npm run-script style`. You can run just the tests by themselves with `npm run-script unit-tests`.
