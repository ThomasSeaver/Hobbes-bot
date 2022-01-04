const { player } = require('../services/audio-player');

const name = 'pause';
const description = 'Pauses currently playing audio';

const execute = async (interaction) => {
  // Handle voice connection
  const channel = interaction.member?.voice?.channel;

  if (!channel) {
    await interaction.reply('Join a channel first!');
    return;
  }

  const { err } = player.pause();

  if (err) {
    await interaction.reply(err);
    return;
  }

  await interaction.reply('Player paused.');
};

module.exports = {
  name,
  description,
  execute,
};