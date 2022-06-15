import player from "../../services/music-player.js";

const name = "add";
const description = "Adds to audio queue, plays if queue is empty";

const execute = async (interaction) => {
  // Handle voice connection
  const channel = interaction.member?.voice?.channel;

  if (!channel) {
    await interaction.reply("Join a channel first!");
    return;
  }

  const { err } = player.play(channel);

  if (err) {
    await interaction.reply(err);
    return;
  }

  await interaction.reply("Audio set to play.");
};

export default { name, description, execute };
