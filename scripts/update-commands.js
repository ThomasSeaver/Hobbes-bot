// Based largely off discord.js guide, mostly with change of how to pull commands

require('dotenv').config();

const { CLIENT_ID, GUILD_ID, TOKEN } = process.env;

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { commands } = require('../commands');

const rest = new REST({ version: '9' }).setToken(TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands },
    );

    await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();
