import { clear } from "./clear";
import { gamble } from "./gamble";
import { pause } from "./pause";
import { ping } from "./ping";
import { play } from "./play";
import { queue } from "./queue";
import { skip } from "./skip";

export const commandList = [clear, gamble, pause, ping, play, skip, queue];

export const triggerList = commandList.map((command) => command.trigger);

export const responseMap = Object.fromEntries(
  commandList.map((command) => [command.trigger.name, command.response])
);
