import { SlashCommandBuilder } from "@discordjs/builders";
import player from "../../services/music-player.js";
import search from "youtube-search";
import ytdlcore from "ytdl-core";
const { validateURL } = ytdlcore;

const command = new SlashCommandBuilder()
  .setName("add")
  .setDescription("Adds to audio queue, plays if queue is empty")
  .addStringOption((option) =>
    option
      .setName("search")
      .setDescription("The term to find a video with or the url to play")
      .setRequired(true)
  )
  .toJSON();

const execute = async (interaction) => {
  // Handle voice connection
  const channel = interaction.member?.voice?.channel;

  if (!channel) {
    interaction.reply("Join a channel first!");
    return;
  }

  let url = null;
  const searchParam = interaction.options.getString("search");

  if (validateURL(searchParam)) {
    const { err, title } = player.add(channel, url);
    if (err) {
      await interaction.reply(err);
      return;
    }

    await interaction.reply(`Added ${title} to queue`);
    return;
  }

  const { results } = await search(searchParam, {
    key: process.env.YOUTUBE_API_KEY,
    maxResults: 1,
  });

  if (results.length != 1) {
    await interaction.reply("Video not found");
    return;
  }

  const { err: playerErr } = player.add(channel, results[0].link);

  if (playerErr) {
    await interaction.reply(playerErr);
    return;
  }

  await interaction.reply(`Added [${results[0].title}] to queue`);
};

export default { ...command, execute };
