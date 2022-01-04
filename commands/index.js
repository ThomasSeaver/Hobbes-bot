const airhorn = require('./airhorn');
const clearMute = require('./clear-mute');
const mute = require('./mute');
const ping = require('./ping');
const syed = require('./syed');

const commands = [clearMute, mute, ping, syed, airhorn];
const testCommands = [...commands];

const functions = {};

commands.forEach(({ name, execute }) => {
  functions[name] = execute;
});

testCommands.forEach(({ name, execute }) => {
  functions[name] = execute;
});

module.exports = { testCommands, commands, functions };
