import { createReadStream } from "node:fs";
import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  demuxProbe,
} from "@discordjs/voice";

import youtubedl from "youtube-dl-exec";
import ytdlcore from "ytdl-core";

const { getInfo } = ytdlcore;

const youtubeDlOptions = {
  exec: "echo filename",
  format: "ba",
};

const filenameRegex = /'.*'/g;

// Ripped from examples on @discordjs/voice
const generateAudioResource = async (url) => {
  const output = await youtubedl(url, youtubeDlOptions);

  const filename = output.match(filenameRegex)[0];
  const parsedFilename = filename.slice(1, filename.length - 1);

  const { stream, type } = await demuxProbe(createReadStream(parsedFilename));
  return createAudioResource(stream, { inputType: type });
};
class AudioPlayer {
  constructor() {
    this.playing = null;
    this.queue = [];
    this.connection = null;
    this.player = createAudioPlayer();

    this.player.on(AudioPlayerStatus.Idle, () => {
      this.playing = null;
      if (this.queue.length > 0) {
        this.playQueuedAudio();
      }
    });
  }

  async add(channel, url) {
    const metadata = await getInfo(url);
    const resource = await generateAudioResource(url);

    if (resource.volume) {
      resource.volume?.setVolume(0.5);
    }

    this.queue.push({ resource, metadata });

    this.generateVoiceConnection(channel);

    if (this.player.state.status === AudioPlayerStatus.Idle) {
      this.playQueuedAudio();
    }

    return { status: "success" };
  }

  remove(index) {
    this.queue.splice(index - 1);
  }

  skip(channel) {
    if (this.player.state.status !== AudioPlayerStatus.Playing) {
      return { err: "Not currently playing audio" };
    }

    this.generateVoiceConnection(channel);

    this.playing = null;

    this.player.stop();
    return { status: "success" };
  }

  play(channel) {
    if (this.player.state.status !== AudioPlayerStatus.Paused) {
      return { err: "Not currently paused" };
    }

    this.generateVoiceConnection(channel);

    this.player.unpause();
    return { status: "success" };
  }

  pause(channel) {
    if (this.player.state.status !== AudioPlayerStatus.Playing) {
      return { err: "Not currently playing audio" };
    }

    this.generateVoiceConnection(channel);

    this.player.pause();
    return { status: "success" };
  }

  stop(channel) {
    if (this.player.state.status !== AudioPlayerStatus.Playing) {
      return { err: "Not currently playing audio" };
    }

    this.generateVoiceConnection(channel);

    this.playing = null;
    this.queue = [];
    this.player.stop();
    return { status: "success" };
  }

  clear(channel) {
    if (this.queue.length === 0) {
      return { err: "Queue is currently empty" };
    }

    this.generateVoiceConnection(channel);

    this.queue = [];
    return { status: "success" };
  }

  queueInfo() {
    if (this.playing === null && this.queue.length === 0) {
      return { err: "Queue is empty, no info to display." };
    }

    const queueData = this.queue.map((track) => ({
      title: track.metadata.videoDetails.title,
      lengthSeconds: track.metadata.videoDetails.lengthSeconds,
    }));

    const { title, lengthSeconds } = this.playing.videoDetails;

    const playbackDuration = Math.floor(
      this.player.state.playbackDuration / 1000
    );

    const playStatus = ` ${Math.floor(playbackDuration / 60)}:${(
      playbackDuration % 60
    )
      .toString()
      .padStart(2, "0")} / ${Math.floor(lengthSeconds / 60)}:${(
      lengthSeconds % 60
    )
      .toString()
      .padStart(2, "0")}`;

    const queueString = `\`\`\`Playing: ${title} | ${playStatus}${
      this.queue.length
        ? `\n\nQueue:\n${queueData
            .map(({ title, lengthSeconds }, index) => {
              const min = Math.floor(lengthSeconds / 60);
              const seconds = (lengthSeconds % 60).toString().padStart(2, "0");

              return `${index + 1}: ${title} | ${min}:${seconds}`;
            })
            .join("\n")}`
        : ""
    }\`\`\``;

    return {
      res: queueString,
    };
  }

  playQueuedAudio() {
    const { resource, metadata } = this.queue.shift();
    this.player.play(resource);
    this.playing = metadata;
  }

  generateVoiceConnection(channel) {
    if (!this.connection || this.connection.channelId !== channel.id) {
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

export { player };
