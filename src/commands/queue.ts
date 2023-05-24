import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { getGuildVoiceData } from "../services/bot-data";

const formatSecondLength = (secondLength: number) =>
  `${Math.floor(secondLength / 60)}:${(secondLength % 60)
    .toString()
    .padStart(2, "0")}`;

export const queueTrigger = new SlashCommandBuilder()
  .setName("queue")
  .setDescription("displays audio queue")
  .toJSON();

export const queueResponse = async (
  interaction: ChatInputCommandInteraction
) => {
  const { playing, player, queue } = getGuildVoiceData(interaction);

  if (playing === null) {
    await interaction.reply("queue is currently empty");
    return;
  }

  const audioMetadataList = [playing, ...queue].map(({ metadata }, index) => {
    const { lengthSeconds, title } = metadata as {
      title: string;
      lengthSeconds: number;
    };

    if (player.state.status !== "playing" || index !== 0) {
      return `${title} | ${formatSecondLength(lengthSeconds)}`;
    }

    return `${title} | ${formatSecondLength(
      Math.floor(player.state.playbackDuration / 1000)
    )} / ${formatSecondLength(lengthSeconds)}`;
  });

  const queueMessage = `\`\`\`\nqueue:\n${audioMetadataList.join("\n")}\`\`\``;

  await interaction.reply(queueMessage);
};

export const queue = { trigger: queueTrigger, response: queueResponse };
