import { SlashCommandBuilder } from "@discordjs/builders";
import { player } from "../../services/music-player.js";

const slashCommand = new SlashCommandBuilder()
  .setName("clear")
  .setDescription("Clears audio queue")
  .toJSON()

const execute = async (interaction) => {
  // Handle voice connection
  const channel = interaction.member?.voice?.channel;

  if (!channel) {
    interaction.reply("Join a channel first!");
    return;
  }

  const { err } = player.clear(channel);

  if (err) {
    await interaction.reply(err);
    return;
  }

  await interaction.reply("Cleared audio queue.");
};

export const clear = { slashCommand, execute };
