import { SlashCommandBuilder } from "@discordjs/builders";
import { player } from "../../services/music-player.js";

const slashCommand = new SlashCommandBuilder()
  .setName("play")
  .setDescription("Plays currently paused audio")
  .toJSON()

const execute = async (interaction) => {
  // Handle voice connection
  const channel = interaction.member?.voice?.channel;

  if (!channel) {
    await interaction.reply("Join a channel first!");
    return;
  }

  const { err } = player.play(channel);

  if (err) {
    await interaction.reply(err);
    return;
  }

  await interaction.reply("Audio set to play.");
};

export const play = { slashCommand, execute };
