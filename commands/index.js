const airhorn = require("./airhorn");
const clear = require("./clear");
const clearMute = require("./clear-mute");
const mute = require("./mute");
const pause = require("./pause");
const ping = require("./ping");
const play = require("./play");
const pong = require("./pong");
const queue = require("./queue");
const resume = require("./resume");
const skip = require("./skip");
const syed = require("./syed");

const commands = [
  airhorn,
  clear,
  clearMute,
  mute,
  pause,
  ping,
  play,
  pong,
  queue,
  resume,
  skip,
  syed,
];

const functions = {};

commands.forEach(({ name, execute }) => {
  functions[name] = execute;
});

module.exports = { commands, functions };
