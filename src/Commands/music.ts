import { CommandData } from "../Modules/CommandManager";
import { MessageEmbed } from "discord.js";
import { Permissions } from "../constants";
import Command from "../Structures/Command";

export const play = new Command(
  "play",
  ["p"],
  "Play song in a voice channel.",
  [
    {
      type: "STRING",
      name: "song",
      description: "Song title/url",
      required: true,
    },
  ],
  2,
  [],
  [
    Permissions.SEND_MESSAGES,
    Permissions.EMBED_LINKS,
    Permissions.SPEAK,
    Permissions.CONNECT,
  ],
  async (commandData: CommandData): Promise<boolean> => {
    const songRequest = commandData.args.join(" ");

    if (!songRequest)
      return commandData.respond(commandData.locales.SPECIFY_SONG, true);

    const song = await commandData.client.player.searchSong(songRequest);

    if (!song)
      return commandData.respond(commandData.locales.SONG_NOT_FOUND, true);

    const serverListener = commandData.client.player.listeners.get(
      commandData.guild.id
    );

    if (!commandData?.author?.voice?.channel?.id)
      return commandData.respond(commandData.locales.JOIN_VC, true);

    if (serverListener && serverListener?.listening) {
      if (
        commandData.author?.voice?.channel?.id !=
        commandData.guild?.me?.voice?.channel?.id
      ) {
        commandData.respond(commandData.locales.NOT_SAME_VC, true);
        return false;
      }

      serverListener.queue.push(song);
      commandData.client.player.listeners.set(
        commandData.guild.id,
        serverListener
      );
      return commandData.respond(
        commandData.locales.ADDED_TO_QUEUE.replace(
          "$song_title",
          song.title
        ).replace("$song_url", song.url),
        true
      );
    }

    try {
      commandData.client.player.serveGuild(
        commandData.guild.id,
        commandData.author.voice.channel.id,
        commandData.channel.id,
        commandData.guild.voiceAdapterCreator,
        commandData.locales,
        song,
        commandData
      );

      return true;
    } catch (err) {
      return false;
    }
  }
);

export const disconnect = new Command(
  "disconnect",
  ["dc"],
  "Disconnects from voice channel if exits.",
  [],
  2,
  [],
  [Permissions.SEND_MESSAGES, Permissions.EMBED_LINKS],
  async (commandData: CommandData): Promise<boolean> => {
    if (!commandData?.guild?.me?.voice?.channel) {
      commandData.respond(commandData.locales.NOT_IN_VC, true);
      return false;
    }

    if (
      commandData.author?.voice?.channel?.id !=
      commandData.guild?.me?.voice?.channel?.id
    ) {
      commandData.respond(commandData.locales.NOT_SAME_VC, true);
      return false;
    }

    commandData.client.player.destroyStream(commandData.guild.id);

    commandData.respond("👍");

    return true;
  }
);

export const skip = new Command(
  "skip",
  ["s"],
  "Skips to another song in the queue.",
  [
    {
      type: "NUMBER",
      name: "song_amount",
      description: "Songs amount to skip in the queue",
      required: true,
    },
  ],
  2,
  [],
  [Permissions.SEND_MESSAGES, Permissions.EMBED_LINKS],
  async (commandData: CommandData): Promise<boolean> => {
    if (!commandData.client.player.isPlaying(commandData.guild.id)) {
      commandData.respond(commandData.locales.NOT_PLAYING, true);
      return false;
    }

    if (
      commandData.author?.voice?.channel?.id !=
      commandData.guild?.me?.voice?.channel?.id
    ) {
      commandData.respond(commandData.locales.NOT_SAME_VC, true);
      return false;
    }

    let songAmount = commandData.args[0] as any;

    if (!songAmount || isNaN(songAmount)) songAmount = 1;

    const isOk = await commandData.client.player.skipSong(
      commandData.guild.id,
      songAmount
    );

    if (!isOk) {
      commandData.client.player.destroyStream(commandData.guild.id);
      commandData.respond(commandData.locales.EMPTY_SONG_QUEUE, true);
      return true;
    } else {
    }

    commandData.respond(
      commandData.locales.SKIPPING_SONG.replace("$count", songAmount)
    );

    return true;
  }
);

export const queue = new Command(
  "queue",
  ["q"],
  "Shows current song queue.",
  [],
  1,
  [],
  [Permissions.SEND_MESSAGES, Permissions.EMBED_LINKS],
  async (commandData: CommandData): Promise<boolean> => {
    if (!commandData.client.player.isPlaying(commandData.guild.id)) {
      commandData.respond(commandData.locales.NOT_PLAYING, true);
      return false;
    }

    if (
      commandData.author?.voice?.channel?.id !=
      commandData.guild?.me?.voice?.channel?.id
    ) {
      commandData.respond(commandData.locales.NOT_SAME_VC, true);
      return false;
    }

    const guild = commandData.client.player.listeners.get(commandData.guild.id);

    if (!guild) {
      commandData.respond(commandData.locales.QUEUE_NOT_FOUND, true);
      return false;
    }

    let queue: string[] = [];

    for (var i = 0; i < guild.queue.length; i++) {
      queue.push(
        `${i + 1} - [${guild.queue[i].title}](${guild.queue[i].url}) ${
          i == 0 ? `- **${commandData.locales.CURRENTLY_PLAYING}**` : ""
        }`
      );
    }

    const queueEmbed = new MessageEmbed();

    queueEmbed
      .setColor("#5865F2")
      .setTitle(`${commandData.guild.name} - ${commandData.locales.SONG_QUEUE}`)
      .setDescription(queue.join("\n"));

    commandData.respond(queueEmbed);

    return true;
  }
);

export const pause = new Command(
  "pause",
  [],
  "Pauses currently playing song.",
  [],
  2,
  [],
  [Permissions.SEND_MESSAGES, Permissions.EMBED_LINKS],
  async (commandData: CommandData): Promise<boolean> => {
    if (!commandData.client.player.isPlaying(commandData.guild.id)) {
      commandData.respond(commandData.locales.NOT_PLAYING, true);
      return false;
    }

    if (
      commandData.author?.voice?.channel?.id !=
      commandData.guild?.me?.voice?.channel?.id
    ) {
      commandData.respond(commandData.locales.NOT_SAME_VC, true);
      return false;
    }

    const isOk = await commandData.client.player.pauseStream(
      commandData.guild.id
    );

    if (isOk) {
      commandData.respond("👍");
    } else {
      commandData.respond(commandData.locales.ERROR, true);
      return false;
    }

    return true;
  }
);

export const resume = new Command(
  "resume",
  ["rs"],
  "Resumes paused song.",
  [],
  2,
  [],
  [Permissions.SEND_MESSAGES, Permissions.EMBED_LINKS],
  async (commandData: CommandData): Promise<boolean> => {
    if (!commandData.client.player.isPlaying(commandData.guild.id)) {
      commandData.respond(commandData.locales.NOT_PLAYING, true);
      return false;
    }

    if (
      commandData.author?.voice?.channel?.id !=
      commandData.guild?.me?.voice?.channel?.id
    ) {
      commandData.respond(commandData.locales.NOT_SAME_VC, true);
      return false;
    }

    const isOk = await commandData.client.player.resumeStream(
      commandData.guild.id
    );

    if (isOk) {
      commandData.respond("👍");
    } else {
      commandData.respond(commandData.locales.ERROR, true);
      return false;
    }

    return true;
  }
);

export const loop = new Command(
  "loop",
  ["rs"],
  "Toggles loop in song queue.",
  [],
  2,
  [],
  [Permissions.SEND_MESSAGES, Permissions.EMBED_LINKS],
  async (commandData: CommandData): Promise<boolean> => {
    if (!commandData.client.player.isPlaying(commandData.guild.id)) {
      commandData.respond(commandData.locales.NOT_PLAYING, true);
      return false;
    }

    if (
      commandData.author?.voice?.channel?.id !=
      commandData.guild?.me?.voice?.channel?.id
    ) {
      commandData.respond(commandData.locales.NOT_SAME_VC, true);
      return false;
    }

    const guild = commandData.client.player.listeners.get(commandData.guild.id);

    if (!guild) {
      commandData.respond(commandData.locales.QUEUE_NOT_FOUND, true);
      return false;
    }

    if (guild.loop) {
      guild.loop = false;
      commandData.respond(commandData.locales.LOOP_DISABLED, true);
    } else {
      guild.loop = true;
      commandData.respond(commandData.locales.LOOP_ENABLED, true);
    }

    return true;
  }
);

export const delsong = new Command(
  "delsong",
  ["ds"],
  "Deletes a specific song from the song queue.",
  [
    {
      type: "NUMBER",
      name: "song_id",
      description: "Song that you want to delete",
      required: true,
    },
  ],
  2,
  [],
  [Permissions.SEND_MESSAGES, Permissions.EMBED_LINKS],
  async (commandData: CommandData): Promise<boolean> => {
    if (!commandData.args[0] || isNaN(commandData.args[0] as any))
      return commandData.respond(commandData.locales.WRONG_COMMAND_USAGE);

    if (!commandData.client.player.isPlaying(commandData.guild.id)) {
      commandData.respond(commandData.locales.NOT_PLAYING, true);
      return false;
    }

    if (
      commandData.author?.voice?.channel?.id !=
      commandData.guild?.me?.voice?.channel?.id
    ) {
      commandData.respond(commandData.locales.NOT_SAME_VC, true);
      return false;
    }

    const guild = commandData.client.player.listeners.get(commandData.guild.id);

    if (!guild) {
      commandData.respond(commandData.locales.QUEUE_NOT_FOUND, true);
      return false;
    }

    const isOk = await commandData.client.player.delSongFromQueue(
      commandData.guild.id,
      commandData.args[0] as any
    );

    if (isOk) {
      commandData.respond(commandData.locales.SUCCESS, true);
      return true;
    }

    commandData.respond(commandData.locales.ERROR, true);

    return true;
  }
);
