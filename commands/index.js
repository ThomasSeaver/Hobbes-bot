import { meme } from "./meme/index.js";
import { music } from "./music/index.js";
import { ping } from "./ping.js";

const commands = [...meme, ...music, ping];

let commandDefinitions = [];
let executeMap = {};

for (const command of commands) {
  commandDefinitions.push(command.slashCommand);
  executeMap[command.slashCommand.name] = command.execute;
}

export { commandDefinitions, executeMap };