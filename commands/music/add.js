import { SlashCommandBuilder } from "@discordjs/builders";
import { player } from "../../services/music-player.js";
import search from "youtube-search";
import ytdlcore from "ytdl-core";
const { getBasicInfo, validateURL } = ytdlcore;

const slashCommand = new SlashCommandBuilder()
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
    await interaction.reply("Join a channel first!");
    return;
  }

  const searchParam = interaction.options.getString("search").trim();

  if (validateURL(searchParam)) {
    const { err } = player.add(channel, searchParam);
    if (err) {
      await interaction.reply(err);
      return;
    }

    const {
      videoDetails: { title },
    } = await getBasicInfo(searchParam);

    console.log(title);
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
  return;
};

export const add = { slashCommand, execute };
