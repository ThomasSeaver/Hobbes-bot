const name = 'clearmute';
const description = 'Clears active mutes';

const execute = async (interaction) => {
  global.MUTED_USERS = [];
  await interaction.reply('Mutes cleared.');
};

module.exports = {
  name,
  description,
  defaultPermission: false,
  execute,
};
