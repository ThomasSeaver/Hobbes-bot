const name = 'airhorn';
const description = 'Plays airhorn for syed!';

const {
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
} = require('@discordjs/voice');
const { join } = require('path');

const execute = async (interaction) => {
  // Grab channels
  const channel = interaction.member?.voice?.channel;

  if (!channel) {
    interaction.reply('Join a channel first!');
    return;
  }

  // Deafen everyone but syed
  channel.members.forEach(({ id, voice }) => {
    if (id !== process.env.SYED_ID) {
      voice.setDeaf();
    }
  });

  // Set up audio resource / player / subscription / connection
  const player = createAudioPlayer();
  const resource = createAudioResource(join(__dirname, '../media/airhorn.mp3'), { inlineVolume: true });
  resource.volume.setVolume(2.0);
  // resource doesn't play until subscription is created
  player.play(resource);

  const connection = joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator,
  });

  const subscription = connection.subscribe(player);

  // Undeafen
  setTimeout(() => {
    channel.members.forEach(({ voice }) => {
      voice.setDeaf(false);
    });
  }, 3 * 1000);

  // Destruct audio stuff
  setTimeout(() => {
    player.stop();
    subscription.unsubscribe();
    connection.destroy();
  }, 4 * 1000);

  await interaction.reply('Joining!');
};

module.exports = {
  name,
  description,
  execute,
};
