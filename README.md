# gh-notifications-snoozer

[![Build status](https://travis-ci.org/cheshire137/gh-notifications-snoozer.svg?branch=master)](https://travis-ci.org/cheshire137/gh-notifications-snoozer)

Lists and filters and snoozing pull requests, oh my! This is an app for managing
your GitHub notifications by way of filtering issues and pull requests that are
of interest to you.

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

You must have a `.env` file containing a GitHub personal access token.

1. [Create a token](https://github.com/settings/tokens/new) with the `repo` scope.
2. From your terminal, run `echo YOUR_TOKEN > .env` where YOUR_TOKEN is the token you got in step one.

### Every Time

Run the app with: `npm start`

## How to Run Tests

    npm install
    npm test

You can run just the style checker by itself with `npm run-script style`. You can run just the tests by themselves with `npm run-script unit-tests`.
