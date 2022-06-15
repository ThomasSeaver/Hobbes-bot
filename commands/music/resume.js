import player from "../../services/music-player.js";

const name = "resume";
const description = "Resumes audio player";

const execute = async (interaction) => {
  // Handle voice connection
  const channel = interaction.member?.voice?.channel;

  if (!channel) {
    await interaction.reply("Join a channel first!");
    return;
  }

  const { err } = player.resume();

  if (err) {
    await interaction.reply(err);
    return;
  }

  await interaction.reply("Player resumed.");
};

export default { name, description, execute };
