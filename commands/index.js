const ping = require('./ping');
const syed = require('./syed');

const commands = [ping, syed];

const functions = {};

commands.forEach(({ name, execute }) => {
  functions[name] = execute;
});

module.exports = { commands, functions };
