import { SlashCommandBuilder } from "@discordjs/builders";
import { player } from "../../services/music-player.js";

const slashCommand = new SlashCommandBuilder()
  .setName("stop")
  .setDescription("Stops currently playing audio, clears the queue")
  .toJSON()

const execute = async (interaction) => {
  // Handle voice connection
  const channel = interaction.member?.voice?.channel;

  if (!channel) {
    await interaction.reply("Join a channel first!");
    return;
  }

  const { err } = player.stop(channel);

  if (err) {
    await interaction.reply(err);
    return;
  }

  await interaction.reply("Stopped audio.");
};

export const stop = { slashCommand, execute };
