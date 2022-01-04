const clearMute = require('./clear-mute');
const mute = require('./mute');
const ping = require('./ping');
const syed = require('./syed');

const commands = [clearMute, mute, ping, syed];

const functions = {};

commands.forEach(({ name, execute }) => {
  functions[name] = execute;
});

module.exports = { commands, functions };
