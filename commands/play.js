const { SlashCommandBuilder } = require('@discordjs/builders');
const { validateURL } = require('ytdl-core');
const { player } = require('../services/audio-player');

const command = new SlashCommandBuilder()
  .setName('play')
  .setDescription('Plays or enqueues attached audio')
  .addStringOption((option) => option.setName('url')
    .setDescription('The url to play')
    .setRequired(true))
  .toJSON();

const execute = async (interaction) => {
  // Handle voice connection
  const channel = interaction.member?.voice?.channel;

  if (!channel) {
    await interaction.reply('Join a channel first!');
    return;
  }

  const url = interaction.options.getString('url');

  if (!validateURL(url)) {
    await interaction.reply('Invalid youtube url.');
    return;
  }

  player.generateVoiceConnection(channel);

  const { err } = player.play(url);

  if (err) {
    await interaction.reply(err);
    return;
  }

  await interaction.reply('Audio set to play.');
};

module.exports = {
  ...command,
  execute,
};
