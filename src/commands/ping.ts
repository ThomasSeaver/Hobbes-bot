import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export const pingTrigger = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("response check")
  .toJSON();

export const pingResponse = async (
  interaction: ChatInputCommandInteraction
) => {
  const rng = Math.random();
  const timeDelta = new Date().getTime() - interaction.createdAt.getTime();

  if (rng < 0.85) {
    await interaction.reply(`Pong! Response time: ${timeDelta} ms`);
  } else if (rng < 0.95) {
    await interaction.reply(`Pung! Response time: ${timeDelta} ms`);
  } else {
    await interaction.reply(`You suck! Response Time: ${timeDelta} ms`);
  }
};

export const ping = { trigger: pingTrigger, response: pingResponse };
