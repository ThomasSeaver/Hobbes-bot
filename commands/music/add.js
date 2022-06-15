import { SlashCommandBuilder } from "@discordjs/builders";
import player from "../../services/music-player.js";
import ytdlcore from "ytdl-core";
const { validateURL } = ytdlcore;

const command = new SlashCommandBuilder()
  .setName("add")
  .setDescription("Adds to audio queue, plays if queue is empty")
  .addStringOption((option) =>
    option.setName("url").setDescription("The url to play").setRequired(true)
  )
  .toJSON();

const execute = async (interaction) => {
  // Handle voice connection
  const channel = interaction.member?.voice?.channel;

  if (!channel) {
    interaction.reply("Join a channel first!");
    return;
  }

  const url = interaction.options.getString("url");

  if (!validateURL(url)) {
    await interaction.reply("Invalid youtube url.");
    return;
  }

  const { err } = player.add(channel, url);

  if (err) {
    await interaction.reply(err);
    return;
  }

  await interaction.reply("Cleared audio queue.");
};

export default { ...command, execute };
