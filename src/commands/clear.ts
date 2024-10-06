import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { AudioPlayerStatus } from "@discordjs/voice";
import { getGuildVoice, clearQueue } from "../services/bot-data";

export const clearTrigger = new SlashCommandBuilder()
  .setName("clear")
  .setDescription("clears queue, including what's currently playing")
  .toJSON();

export const clearResponse = async (
  interaction: ChatInputCommandInteraction,
) => {
  const { player, playing } = getGuildVoice(interaction);

  if (playing === null) {
    throw new Error("nothing is playing right now");
  }

  switch (player.state.status) {
    case AudioPlayerStatus.Playing || AudioPlayerStatus.Paused:
      clearQueue(interaction);
      player.stop();
      await interaction.reply("queue cleared");
      break;
    default:
      await interaction.reply("player is currently in incompatible state");
  }
};

export const clear = { trigger: clearTrigger, response: clearResponse };
