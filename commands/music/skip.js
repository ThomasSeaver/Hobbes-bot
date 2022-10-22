import { SlashCommandBuilder } from "@discordjs/builders";
import { player } from "../../services/music-player.js";

const slashCommand = new SlashCommandBuilder()
  .setName("skip")
  .setDescription("Skips currently playing audio")
  .toJSON()

const execute = async (interaction) => {
  // Handle voice connection
  const channel = interaction.member?.voice?.channel;

  if (!channel) {
    await interaction.reply("Join a channel first!");
    return;
  }

  const { err } = player.skip(channel);

  if (err) {
    await interaction.reply(err);
    return;
  }

  await interaction.reply("Skipped audio.");
};

export const skip = { slashCommand, execute };
