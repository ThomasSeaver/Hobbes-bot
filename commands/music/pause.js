import { SlashCommandBuilder } from "@discordjs/builders";
import { player } from "../../services/music-player.js";

const slashCommand = new SlashCommandBuilder()
  .setName("pause")
  .setDescription("Pauses currently playing audio")
  .toJSON()

const execute = async (interaction) => {
  // Handle voice connection
  const channel = interaction.member?.voice?.channel;

  if (!channel) {
    await interaction.reply("Join a channel first!");
    return;
  }

  const { err } = player.pause(channel);

  if (err) {
    await interaction.reply(err);
    return;
  }

  await interaction.reply("Player paused.");
};

export const pause = { slashCommand, execute };
