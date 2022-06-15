import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  demuxProbe,
} from "@discordjs/voice";

import ytdlexec from "youtube-dl-exec";
import ytdlcore from "ytdl-core";

const { exec } = ytdlexec;
const { getInfo } = ytdlcore;

// Ripped from examples on @discordjs/voice
const generateAudioResource = (url) =>
  new Promise((resolve, reject) => {
    const process = exec(
      url,
      {
        o: "-",
        q: "",
        f: "bestaudio[ext=webm+acodec=opus+asr=48000]/bestaudio",
        r: "100K",
      },
      { stdio: ["ignore", "pipe", "ignore"] }
    );

    if (!process.stdout) {
      reject(new Error("No stdout"));
      return;
    }

    const stream = process.stdout;

    const onError = (error) => {
      if (!process.killed) process.kill();
      stream.resume();
      reject(error);
    };

    process
      .once("spawn", () => {
        demuxProbe(stream)
          .then((probe) =>
            resolve(
              createAudioResource(probe.stream, {
                inlineVolume: true,
                inputType: probe.type,
              })
            )
          )
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
      if (this.queue.length > 0) {
        this.playQueuedAudio();
      }
    });
  }

  async add(url) {
    const metadata = await getInfo(url);
    const resource = await generateAudioResource(url);

    this.queue.push({ resource, metadata });

    if (this.player.state === AudioPlayerStatus.idle) {
      this.playQueuedAudio();
    }

    return { status: "success" };
  }

  remove(index) {
    this.queue.splice(index - 1);
  }

  skip() {
    if (this.player.state === AudioPlayerStatus.Playing) {
      return { err: "Not currently playing audio" };
    }
    this.player.stop();
    return { status: "success" };
  }

  play() {
    if (this.player.state === AudioPlayerStatus.Paused) {
      return { err: "Not currently paused" };
    }

    this.player.unpause();
    return { status: "success" };
  }

  pause() {
    if (this.player.state === AudioPlayerStatus.Playing) {
      return { err: "Not currently playing audio" };
    }

    this.player.pause();
    return { status: "success" };
  }

  stop() {
    if (this.player.state === AudioPlayerStatus.Playing) {
      return { err: "Not currently playing audio" };
    }

    this.queue = [];
    this.player.stop();
    return { status: "success" };
  }

  clear() {
    this.queue = [];
    return { status: "success" };
  }

  queueInfo() {
    if (this.playing === null && this.queue.length === 0) {
      return { err: "Queue is empty, no info to display." };
    }

    const queueData = [...this.queue.map(({ metadata }) => metadata)];

    return {
      res: `\`\`\`${
        this.playing && `Playing ${this.playing.videoDetails.title}`
      }\n${queueData
        .map(
          (metadata, index) => `${index + 1}. ${metadata.videoDetails.title}`
        )
        .join("\n")}\`\`\``,
    };
  }

  playQueuedAudio() {
    const { resource, metadata } = this.queue.shift();
    this.player.play(resource);
    this.playing = metadata;
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

export default player;
