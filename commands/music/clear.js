import player from "../../services/music-player.js";

const name = "clear";
const description = "Clears audio queue";

const execute = async (interaction) => {
  // Handle voice connection
  const channel = interaction.member?.voice?.channel;

  if (!channel) {
    interaction.reply("Join a channel first!");
    return;
  }

  const { err } = player.clear(channel);

  if (err) {
    await interaction.reply(err);
    return;
  }

  await interaction.reply("Cleared audio queue.");
};

export default { name, description, execute };
