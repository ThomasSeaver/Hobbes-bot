import { SlashCommandBuilder } from "@discordjs/builders";

const slashCommand = new SlashCommandBuilder()
  .setName("Ping")
  .setDescription("Replies with pong")
  .toJSON()

const execute = async (interaction) => {
  await interaction.reply(
    `Pong! Response time: ${Date.now() - interaction.createdAt} ms`
  );
};

export const ping = { slashCommand, execute };
