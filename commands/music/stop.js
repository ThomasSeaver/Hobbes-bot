import player from "../../services/music-player.js";

const name = "stop";
const description = "Stops currently playing audio, clears the queue";

const execute = async (interaction) => {
  // Handle voice connection
  const channel = interaction.member?.voice?.channel;

  if (!channel) {
    await interaction.reply("Join a channel first!");
    return;
  }

  const { err } = player.stop(channel);

  if (err) {
    await interaction.reply(err);
    return;
  }

  await interaction.reply("Stopped audio.");
};

export default { name, description, execute };
