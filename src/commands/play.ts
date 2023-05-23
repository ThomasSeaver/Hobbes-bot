import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import {
  AudioPlayerStatus,
  createAudioResource,
  demuxProbe,
} from "@discordjs/voice";
import {
  getInfo,
  chooseFormat,
  downloadFromInfo,
  validateURL,
} from "ytdl-core";
import ytsr, { Video } from "ytsr";
import { getGuildVoice, getGuildVoiceData } from "../services/bot-data";

export const playTrigger = new SlashCommandBuilder()
  .setName("play")
  .setDescription(
    "plays audio, or adds to queue if something is already playing"
  )
  .addStringOption((option) =>
    option
      .setName("search")
      .setDescription("The term to find a video with or the url to play")
      .setRequired(false)
  )
  .toJSON();

export const playResponse = async (
  interaction: ChatInputCommandInteraction
) => {
  const searchOption = interaction.options.getString("search");

  if (searchOption === null) {
    const { playing, player } = getGuildVoiceData(interaction);
    if (playing === null) {
      throw new Error("nothing is playing right now");
    }
    if (player.state.status !== AudioPlayerStatus.Playing) {
      throw new Error("player is not paused");
    }
    player.unpause();
    await interaction.reply("unpausing audio");
    return;
  }

  await interaction.deferReply();

  let url = searchOption;

  if (!validateURL(url)) {
    const searchResults = await ytsr(url);
    const videos = searchResults.items.filter(
      (item): item is Video => item.type === ("video" as const)
    );
    url = videos[0]?.url;
  }

  const { queue } = getGuildVoice(interaction);

  const info = await getInfo(url);

  const format = chooseFormat(info.formats, {
    quality: "highestaudio",
    filter: "audioonly",
  });

  const { title, lengthSeconds } = info.videoDetails;

  const { stream, type } = await demuxProbe(downloadFromInfo(info, { format }));

  queue.push(
    createAudioResource(stream, {
      inputType: type,
      metadata: { title, lengthSeconds },
    })
  );

  await interaction.editReply("queueing audio");
};

export const play = { trigger: playTrigger, response: playResponse };
