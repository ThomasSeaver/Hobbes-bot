const name = 'syed';
const description = 'Temporarily (5 minutes) prevents Syed from sending messages!';

const execute = async (interaction) => {
  const { SYED_ID } = process.env;

  const { MUTED_USERS = [] } = global;
  global.MUTED_USERS = [...MUTED_USERS, SYED_ID];

  setTimeout(() => {
    global.MUTED_USERS = global.MUTED_USERS.filter((id) => id !== SYED_ID);
  }, 5 * 60 * 1000);

  await interaction.reply('Syed is no longer an issue!');
};

module.exports = {
  name,
  description,
  execute,
};
