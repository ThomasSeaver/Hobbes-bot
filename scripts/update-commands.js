// Based largely off discord.js guide

require('dotenv').config();

const {
  ADMIN_ROLE_ID, CLIENT_ID, GUILD_ID, TOKEN, TOM_ID,
} = process.env;

const { Client, Intents } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { commands } = require('../commands');

const rest = new REST({ version: '9' }).setToken(TOKEN);

(async () => {
  // Add / update commands
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

  // Set permissions
  await client.login(TOKEN);

  // Perms allow for admin role id and my id
  const permissions = [{
    id: TOM_ID,
    type: 'USER',
    permission: true,
  }, {
    id: ADMIN_ROLE_ID,
    type: 'ROLE',
    permission: true,
  }];

  // Fetch list, generate full perms, go through each guild and update
  try {
    const commandList = await rest.get(
      Routes.applicationCommands(CLIENT_ID),
    );

    const fullPermissions = commandList
      .filter((command) => !command.defaultPermission)
      .map(({ id }) => ({
        id,
        permissions,
      }));

    const guilds = await client.guilds.cache;

    await guilds.forEach(
      // eslint-disable-next-line no-return-await, max-len
      async (guild) => await client.guilds.cache.get(guild.id)?.commands.permissions.set({ fullPermissions }),
    );
  } catch (error) {
    console.error(error);
  }

  client.destroy();
})();
