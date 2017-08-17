# winston-slack-hook [![Travis Build Status](https://travis-ci.org/fahad19/winston-slack-hook.svg?branch=master)](https://travis-ci.org/fahad19/winston-slack-hook) [![npm](https://img.shields.io/npm/v/winston-slack-hook.svg)](https://www.npmjs.com/package/winston-slack-hook)

> Slack WebHook transport for Winston logger library

## Install

```
$ npm install --save winston winston-slack-hook
```

## Requirements

* Use [winston](https://github.com/winstonjs/winston)
* Set up [Slack incoming webhook](https://api.slack.com/incoming-webhooks)

## Usage

### Basic

```js
var winston = require('winston');
var SlackHook = require('winston-slack-hook');

var Logger = winston.Logger;
var Console = winston.transports.Console;

var logger = new Logger({
  transports: [
    new Console({}),
    new SlackHook({
      hookUrl: 'https://hooks.slack.com/services/XXX/YYY/ZZZ',
      username: 'bot',
      channel: '#logs'
    })
  ]
});

logger.info('I am being logged here'); // will be sent to both console and Slack
```

### Options

Require:

* `hookUrl`: Slack URL to post to
* `username`: Message will be posted as this username
* `channel`: The channel to post in

Optional:

* `iconEmoji`: Give the username an emoji as an avatar
* `prependLevel`: set to `true` by default, sets `[level]` at the beginning of the message
* `appendMeta`: set to `true` by default, sets stringified `meta` at the end of the message
* `formatter(options)`: function for transforming the message before posting to Slack
* `colors`: set to `{}` by default (no colors), set the color of the message given a level.

### Formatter and colors

Messages can be formatted further before posting to Slack:

```js
var logger = new Logger({
  transports: [
    new SlackHook({
      hookUrl: 'https://hooks.slack.com/services/XXX/YYY/ZZZ',
      username: 'bot',
      channel: '#logs',

      formatter: function (options) {
        var message = options.message; // original message

        // var level = options.level;
        // var meta = options.meta;

        // do something with the message

        return message;
      },
      colors: {
        warn: 'warning',
        error: 'danger',
        info: 'good',
        debug: '#bbddff'
      }
    })
  ]
});
```

## License

MIT © [Fahad Ibnay Heylaal](http://fahad19.com)
