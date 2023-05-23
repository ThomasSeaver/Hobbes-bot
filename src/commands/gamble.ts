import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { getVoiceChannel } from "../services/bot-data";

export const gambleTrigger = new SlashCommandBuilder()
  .setName("gamble")
  .setDescription("it's a collective gamble!")
  .toJSON();

export const gambleResponse = async (
  interaction: ChatInputCommandInteraction
) => {
  const channel = getVoiceChannel(interaction);

  const members = Array.from(channel.members);
  const randomIndex = Math.floor(Math.random() * members.length);
  const member = members[randomIndex][1];

  member.voice
    .disconnect()
    .catch((error: unknown) =>
      console.error("Error thrown when disconnecting: ", error)
    );

  await interaction.reply(
    `You lost the roulette <@${member.id}>; you should rejoin unless you hate them now`
  );
};

export const gamble = { response: gambleResponse, trigger: gambleTrigger };
