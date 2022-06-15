const name = "shivam";
const description = "you'll know what this one should do";

const execute = async (interaction) => {
  // Handle voice connection
  const channel = interaction.member?.voice?.channel;

  if (!channel) {
    interaction.reply("Join a channel first!");
    return;
  }

  const members = Array.from(channel.members);
  const member = members[Math.floor(Math.random() * members.length)][1];
  member.voice.disconnect();

  await interaction.reply(`get shivamed ${member.nickname}`);
};

export default { name, description, execute };
