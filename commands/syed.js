const name = 'syed';
const description = 'Temporarily (5 minutes) prevents Syed from sending messages!';

const execute = async (interaction) => {
  process.env.SYED_MUTED = true;

  setTimeout(() => {
    process.env.SYED_MUTED = false;
  }, 5 * 60 * 1000);

  await interaction.reply('Syed is no longer an issue!');
};

module.exports = {
  name,
  description,
  execute,
};
