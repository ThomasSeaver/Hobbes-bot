const {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  demuxProbe,
} = require('@discordjs/voice');
const { exec } = require('youtube-dl-exec');
const { getInfo } = require('ytdl-core');

// Ripped from examples on @discordjs/voice
const generateAudioResource = (url) => new Promise((resolve, reject) => {
  const process = exec(
    url,
    {
      o: '-',
      q: '',
      f: 'bestaudio[ext=webm+acodec=opus+asr=48000]/bestaudio',
      r: '100K',
    },
    { stdio: ['ignore', 'pipe', 'ignore'] },
  );

  if (!process.stdout) {
    reject(new Error('No stdout'));
    return;
  }

  const stream = process.stdout;

  const onError = (error) => {
    if (!process.killed) process.kill();
    stream.resume();
    reject(error);
  };

  process
    .once('spawn', () => {
      demuxProbe(stream)
        .then((probe) => resolve(
          createAudioResource(probe.stream, { inlineVolume: true, inputType: probe.type }),
        ))
        .catch(onError);
    })
    .catch(onError);
});

class AudioPlayer {
  constructor() {
    this.playing = null;
    this.queue = [];
    this.connection = null;
    this.player = createAudioPlayer();

    this.player.on(AudioPlayerStatus.Idle, () => {
      this.playing = null;
      if (this.queue.length > 0) {
        const { resource, metadata } = this.queue.shift();
        resource.volume.setVolume(0.5);
        this.player.play(resource);
        this.playing = metadata;
      }
    });
  }

  async play(url) {
    const metadata = await getInfo(url);

    if (this.queue.length === 0 && this.player.state.status === AudioPlayerStatus.Idle) {
      const resource = await generateAudioResource(url);
      resource.volume.setVolume(0.5);
      this.player.play(resource);
      this.playing = metadata;
    } else {
      const resource = generateAudioResource(url);
      this.queue.push({ resource, metadata });
    }

    return { status: 'success' };
  }

  skip() {
    if (!this.connection) {
      return { err: 'Can\'t skip, not connected to a voice channel.' };
    }

    if (this.player.state.status === AudioPlayerStatus.Idle) {
      return { err: 'Can\'t skip, no currently playing audio.' };
    }

    // Calling stop forces it into the idle state, so it'll trigger next song
    this.player.stop();

    return { status: 'success' };
  }

  pause() {
    if (!this.connection) {
      return { err: 'Can\'t pause, not connected to a voice channel.' };
    }

    if (this.player.state.status !== AudioPlayerStatus.Playing) {
      return { err: 'Can\'t pause, no currently playing audio.' };
    }

    this.player.pause();

    return { status: 'success' };
  }

  resume() {
    if (!this.connection) {
      return { err: 'Can\'t resume, not connected to a voice channel.' };
    }

    if (this.player.state.status !== AudioPlayerStatus.Paused) {
      return { err: 'Can\'t resume, not currently paused.' };
    }

    this.player.unpause();

    return { status: 'success' };
  }

  clear() {
    if (!this.connection) {
      return { err: 'Can\'t clear, not connected to a voice channel.' };
    }

    if (this.queue.length === 0) {
      return { err: 'Can\'t clear, queue is already empty.' };
    }

    this.queue = [];

    return { status: 'success' };
  }

  queueInfo() {
    if (this.playing === null && this.queue.length === 0) {
      return { err: 'Queue is empty, no info to display.' };
    }

    const queueData = [this.playing, ...this.queue.map(({ metadata }) => metadata)];

    return { res: `\`\`\`${queueData.map((metadata, index) => `${index + 1}. ${metadata.videoDetails.title}`).join('\n')}\`\`\`` };
  }

  generateVoiceConnection(channel) {
    if (!this.connection) {
      this.connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
      });

      this.connection.subscribe(this.player);
    }

    return this.connection;
  }
}

const player = new AudioPlayer();

module.exports = {
  player,
};
