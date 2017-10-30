var util = require('util');
var request = require('request');

var winston = require('winston');

var SlackHook = winston.transports.SlackHook = function (options) {
  this.name = options.name || 'slackHook';
  this.level = options.level || 'info';

  this.username = options.username || 'bot';
  this.hookUrl = options.hookUrl || null;
  this.channel = options.channel || '#logs';
  this.iconEmoji = options.iconEmoji || null;

  this.prependLevel = options.prependLevel === undefined ? true : options.prependLevel;
  this.appendMeta = options.appendMeta === undefined ? true : options.appendMeta;

  this.formatter = options.formatter || null;
  this.colors = options.colors || {};
};

util.inherits(SlackHook, winston.Transport);

SlackHook.prototype.log = function (level, msg, meta, callback) {
  var message = '';

  if (this.prependLevel && !this.colors[level]) {
    message += '[' + level + '] ';
  }

  message += msg;

  if (
    this.appendMeta &&
    meta &&
    Object.getOwnPropertyNames(meta).length
  ) {
    // http://stackoverflow.com/questions/18391212/is-it-not-possible-to-stringify-an-error-using-json-stringify#comment57014279_26199752
    message += ' ```' + JSON.stringify(meta, Object.getOwnPropertyNames(meta), 2) + '```';
  }

  if (typeof this.formatter === 'function') {
    message = this.formatter({
      level: level,
      message: message,
      meta: meta
    });
  }

  var payload = {
    channel: this.channel,
    username: this.username,
    text: message
  };

  if (this.colors[level]) {
    payload.text = this.prependLevel ? level : null;
    payload.attachments = [{
      text: message,
      color: this.colors[level],
      mrkdwn_in: ['text', 'pretext']
    }];
  }

  if (this.iconEmoji) {
    payload.icon_emoji = this.iconEmoji; // jshint ignore:line
  }

  request
    .post(this.hookUrl)
    .form({
      payload: JSON.stringify(payload)
    })
    .on('response', function (response) {
      if (response.statusCode === 200) {
        callback(null, true);
        return;
      }

      callback('Server responded with ' + response.statusCode);
    })
    .on('error', function (error) {
      callback(error);
    });
};

module.exports = SlackHook;
