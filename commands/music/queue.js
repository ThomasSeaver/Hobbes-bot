import player from "../../services/audio-player.js";

const name = "queue";
const description = "Displays current queue";

const execute = async (interaction) => {
  // Handle voice connection
  const channel = interaction.member?.voice?.channel;

  if (!channel) {
    await interaction.reply("Join a channel first!");
    return;
  }

  const { res, err } = player.queueInfo();

  if (err) {
    await interaction.reply(err);
    return;
  }

  await interaction.reply(res);
};

export default { name, description, execute };
