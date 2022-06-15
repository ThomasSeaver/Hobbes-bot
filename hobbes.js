import "dotenv/config";
import { Client, Intents } from "discord.js";
import functions from "./commands/index.js";

import "./scripts/update-commands.js";

const { TOKEN } = process.env;

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { execute } = functions[interaction.commandName];

  await execute(interaction);
});

client.login(TOKEN);
