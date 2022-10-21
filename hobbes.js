import "dotenv/config";
import { Client, GatewayIntentBits, REST, Routes } from 'discord.js';
import commands from "../commands/index.js";

const { CLIENT_ID, TOKEN } = process.env;

console.log("Initializing Hobbes");

const rest = new REST({ version: '10' }).setToken(TOKEN);

// Updates application commands on startup
(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

// Handle interactions
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  console.log("Attempting to execute: ", interaction.commandName);

  const { execute } = commands[interaction.commandName];

  await execute(interaction);
});

client.login(TOKEN);