/* eslint-disable @typescript-eslint/no-misused-promises */
import { Client, GatewayIntentBits, REST, Routes } from "discord.js";
import { generateDependencyReport } from "@discordjs/voice";
import { CLIENT_ID, TOKEN } from "./env";
import { triggerList, responseMap } from "./commands";

console.log("Initializing Hobbes");

console.log("Voice dependency report \n", generateDependencyReport());

const rest = new REST({ version: "10" }).setToken(TOKEN);

// Updates application commands on startup
console.log("Started refreshing application (/) commands.");
rest
  .put(Routes.applicationCommands(CLIENT_ID), {
    body: triggerList,
  })
  .then(() => console.log("Successfully reloaded application (/) commands."))
  .catch((error) => console.error(error));

// Handle interactions
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.on("ready", (realizedClient) => {
  console.log(`Logged in as ${realizedClient.user.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) {
    console.error("Not a chat input command", interaction);
    return;
  }

  console.log("Attempting to execute: ", interaction.commandName);

  if (!(interaction.commandName in responseMap)) {
    console.error("No response function ", interaction);
    await interaction.reply("Can't find response function...");
    return;
  }

  try {
    await responseMap[interaction.commandName](interaction);
  } catch (error) {
    console.error("caught error: ", error);
    const errorMessage =
      error instanceof Error ? `error: ${error.message}` : "unexpected error";
    if (interaction.deferred) {
      await interaction.editReply(errorMessage);
    } else {
      await interaction.reply(errorMessage);
    }
  }
});

client
  .login(TOKEN)
  .then(() => console.log("Successfully logged in!"))
  .catch((error) => console.error("Error logging in: ", error));
