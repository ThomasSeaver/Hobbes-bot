import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { AudioPlayerStatus } from "@discordjs/voice";
import { getGuildVoice } from "../services/bot-data";

export const skipTrigger = new SlashCommandBuilder()
  .setName("skip")
  .setDescription("skips currently playing audio")
  .toJSON();

export const skipResponse = async (
  interaction: ChatInputCommandInteraction,
) => {
  const { player, playing } = getGuildVoice(interaction);

  if (playing === null) {
    throw new Error("nothing is playing right now");
  }

  switch (player.state.status) {
    case AudioPlayerStatus.Playing:
      player.stop();
      await interaction.reply("audio skipped");
      break;
    default:
      await interaction.reply("player is currently in incompatible state");
  }
};

export const skip = { trigger: skipTrigger, response: skipResponse };
