import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  demuxProbe,
  generateDependencyReport,
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
    console.log(generateDependencyReport());
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

    //this.generateVoiceConnection(channel);

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

    const queueString = `\`\`\`Playing: ${title} | ${playStatus}${this.queue.length
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
