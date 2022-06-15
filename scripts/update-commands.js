// Based largely off discord.js guide

import "dotenv/config";

import { Client, Intents } from "discord.js";

import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import commands from "../commands/index.js";

const { CLIENT_ID, TOKEN } = process.env;

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
  // Add / update commands
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands(CLIENT_ID), {
      body: Object.values(commands),
    });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }

  // Set permissions
  await client.login(TOKEN);

  client.destroy();
})();
