# gh-notifications-snoozer

Lists and rules and snoozing PRs, oh my!

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
