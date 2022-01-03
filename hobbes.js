require('dotenv').config();

const { SYED_ID, TOKEN } = process.env;

const { Client, Intents } = require('discord.js');
const { functions } = require('./commands');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const execute = functions[interaction.commandName];

  await execute(interaction);
});

client.on('messageCreate', async (message) => {
  const { SYED_MUTED } = process.env;

  if (SYED_MUTED === 'true' && message.author.id === SYED_ID) {
    await message.delete();
  }
});

client.login(TOKEN);
