const airhorn = require("./airhorn");
const clear = require("./clear");
const clearMute = require("./clear-mute");
const mute = require("./mute");
const pause = require("./pause");
const ping = require("./ping");
const pong = require("./pong");
const play = require("./play");
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
  queue,
  resume,
  skip,
  syed,
  pong,
];

module.exports = { commands };
