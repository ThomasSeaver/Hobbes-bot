import { SlashCommandBuilder } from "@discordjs/builders";
import { player } from "../../services/music-player.js";

const slashCommand = new SlashCommandBuilder()
  .setName("queue")
  .setDescription("Displays current queue")
  .toJSON()

const execute = async (interaction) => {
  const { res, err } = player.queueInfo();

  if (err) {
    await interaction.reply(err);
    return;
  }

  await interaction.reply(res);
};

export const queue = { slashCommand, execute };
