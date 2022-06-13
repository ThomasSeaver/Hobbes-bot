const name = "pong";
const description = "Replies with ping!";

const execute = async (interaction) => {
  await interaction.reply(
    `Ping! Response time: ${Date.now() - interaction.createdAt} ms`
  );
};

module.exports = {
  name,
  description,
  execute,
};
