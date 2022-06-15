// Based largely off discord.js guide

require("dotenv").config();

const { CLIENT_ID, TOKEN } = process.env;

const { Client, Intents } = require("discord.js");

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { commands } = require("../commands");

const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
  // Add / update commands
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }

  // Set permissions
  await client.login(TOKEN);

  client.destroy();
})();
