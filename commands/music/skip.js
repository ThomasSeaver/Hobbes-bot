import player from "../../services/audio-player.js";

const name = "skip";
const description = "Skips currently playing audio";

const execute = async (interaction) => {
  // Handle voice connection
  const channel = interaction.member?.voice?.channel;

  if (!channel) {
    await interaction.reply("Join a channel first!");
    return;
  }

  const { err } = player.skip();

  if (err) {
    await interaction.reply(err);
    return;
  }

  await interaction.reply("Skipped audio.");
};

export default { name, description, execute };
