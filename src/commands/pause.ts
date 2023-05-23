import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { AudioPlayerStatus } from "@discordjs/voice";
import { getGuildVoice } from "../services/bot-data";

export const pauseTrigger = new SlashCommandBuilder()
  .setName("pause")
  .setDescription("toggles pause state of currently playing audio")
  .toJSON();

export const pauseResponse = async (
  interaction: ChatInputCommandInteraction
) => {
  const { player, playing } = getGuildVoice(interaction);

  if (playing === null) {
    throw new Error("nothing is playing right now");
  }

  switch (player.state.status) {
    case AudioPlayerStatus.Playing:
      player.pause();
      await interaction.reply("audio paused");
      break;
    case AudioPlayerStatus.Paused:
      player.unpause();
      await interaction.reply("audio unpaused");
      break;
    default:
      await interaction.reply("player is currently in incompatible state");
  }
};

export const pause = { trigger: pauseTrigger, response: pauseResponse };
