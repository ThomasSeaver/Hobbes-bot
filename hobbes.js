require('dotenv').config();

const { TOKEN } = process.env;

const { Client, Intents } = require('discord.js');
const { functions } = require('./commands');

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES],
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const execute = functions[interaction.commandName];

  await execute(interaction);
});

client.on('messageCreate', async (message) => {
  const { MUTED_USERS = [] } = global;

  if (MUTED_USERS.find((user) => user.id === message.author.id)) {
    await message.delete();
  }
});

client.login(TOKEN);
