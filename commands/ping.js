const name = "ping";
const description = "Replies with pong!";

const execute = async (interaction) => {
  await interaction.reply(
    `Pong! Response time: ${Date.now() - interaction.createdAt} ms`
  );
};

export default { name, description, execute };
