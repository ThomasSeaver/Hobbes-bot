const { SlashCommandBuilder } = require('@discordjs/builders');

const command = new SlashCommandBuilder()
  .setName('mute')
  .setDescription('Mute a user!')
  .addUserOption((option) => option.setName('user')
    .setDescription('The user to mute')
    .setRequired(true))
  .addIntegerOption((option) => option.setName('minutes')
    .setDescription('Amount of minutes to mute (default 5)')
    .setRequired(true))
  .toJSON();

const execute = async (interaction) => {
  const target = interaction.options.getUser('user');
  const minutes = interaction.options.getInteger('minutes') || 5;

  const { MUTED_USERS = [] } = global;

  global.MUTED_USERS = [...MUTED_USERS, target.id];

  setTimeout(() => {
    global.MUTED_USERS = global.MUTED_USERS.filter((id) => id !== target.id);
  }, minutes * 60 * 1000);

  await interaction.reply(`${target.nickname} is no longer an issue for ${minutes} minutes!`);
};

module.exports = {
  ...command,
  defaultPermission: false,
  execute,
};
