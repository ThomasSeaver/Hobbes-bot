import player from "../../services/music-player.js";

const name = "queue";
const description = "Displays current queue";

const execute = async (interaction) => {
  const { res, err } = player.queueInfo();

  if (err) {
    await interaction.reply(err);
    return;
  }

  await interaction.reply(res);
};

export default { name, description, execute };
