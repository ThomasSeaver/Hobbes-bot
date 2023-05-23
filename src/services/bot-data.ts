import {
  createAudioPlayer,
  joinVoiceChannel,
  AudioPlayer,
  AudioResource,
  VoiceConnection,
  AudioPlayerStatus,
} from "@discordjs/voice";
import { ChatInputCommandInteraction } from "discord.js";

export type HobbesData = {
  [guildId: string]: {
    audio: {
      connection: VoiceConnection;
      player: AudioPlayer;
      playing: AudioResource | null;
      queue: AudioResource[];
    };
  };
};

const data: HobbesData = {};

export const getVoiceChannel = (interaction: ChatInputCommandInteraction) => {
  const { member } = interaction;

  if (
    member === null ||
    !("voice" in member) ||
    !("channel" in member.voice) ||
    member.voice.channel === null
  )
    throw new Error("Join a channel first!");

  return member.voice.channel;
};

export const getGuildVoice = (interaction: ChatInputCommandInteraction) => {
  const { member, guild } = interaction;
  if (guild === null) throw new Error("guild is missing from interaction");
  if (member === null) throw new Error("member is missing from interaction");

  const channel =
    member === null || "voice" in member ? member.voice.channel : null;

  if (channel === null) throw new Error("join a voice channel first");

  if (data[guild.id] === undefined || !("audio" in data[guild.id])) {
    data[guild.id] = {
      audio: {
        connection: joinVoiceChannel({
          adapterCreator: guild.voiceAdapterCreator,
          channelId: channel.id,
          guildId: guild.id,
        }),
        player: createAudioPlayer(),
        playing: null,
        queue: [],
      },
    };

    data[guild.id].audio.connection.subscribe(data[guild.id].audio.player);
    data[guild.id].audio.player.on("error", (error) => {
      console.error("audio player", error);
    });

    const playFromQueue = () => {
      const playing = data[guild.id].audio.queue.shift() ?? null;
      data[guild.id].audio.playing = playing;
      if (playing !== null) {
        data[guild.id].audio.player.play(playing);
      }
    };

    const playFromQueueOrDestroy = () => {
      if (data[guild.id].audio.queue.length > 0) {
        playFromQueue();
      } else {
        setTimeout(() => {
          if (data[guild.id].audio.queue.length > 0) {
            playFromQueue();
          } else {
            data[guild.id].audio.connection.destroy();
            delete data[guild.id];
          }
        }, 3000);
      }
    };

    data[guild.id].audio.player.on(
      AudioPlayerStatus.Idle,
      playFromQueueOrDestroy
    );

    playFromQueueOrDestroy();
  }

  return data[guild.id].audio;
};

export const getGuildVoiceData = (interaction: ChatInputCommandInteraction) => {
  const { member, guild } = interaction;
  if (guild === null) throw new Error("guild is missing from interaction");
  if (member === null) throw new Error("member is missing from interaction");

  const channel =
    member === null || "voice" in member ? member.voice.channel : null;

  if (
    channel === null ||
    data[guild.id] === undefined ||
    !("audio" in data[guild.id])
  )
    throw new Error("join a voice channel first");

  return data[guild.id].audio;
};

export const clearQueue = (interaction: ChatInputCommandInteraction) => {
  const { member, guild } = interaction;
  if (guild === null) throw new Error("guild is missing from interaction");
  if (member === null) throw new Error("member is missing from interaction");

  const channel =
    member === null || "voice" in member ? member.voice.channel : null;

  if (channel === null) throw new Error("join a voice channel first");

  if (data[guild.id] === undefined || !("audio" in data[guild.id])) {
    throw new Error("guild audio data missing");
  }

  data[guild.id].audio.queue = [];
};
