const name = 'ping';
const description = 'Replies with pong!';

const execute = async (interaction) => {
  await interaction.reply('Pong!');
};

module.exports = {
  name,
  description,
  execute,
};
