import CommandContext from "../Structures/CommandContext";
import { MessageEmbed } from "discord.js";
import { Permissions } from "../constants";
import Command from "../Structures/Command";
import fetch from "cross-fetch";

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
  async (ctx: CommandContext): Promise<boolean> => {
    const songRequest = ctx.args.join(" ");

    if (!songRequest) return ctx.respond(ctx.locales.SPECIFY_SONG, true);

    const song = await ctx.client.player.searchSong(songRequest);

    if (!song) return ctx.respond(ctx.locales.SONG_NOT_FOUND, true);

    const serverListener = ctx.client.player.listeners.get(ctx.guild.id);

    if (!ctx?.author?.voice?.channel?.id)
      return ctx.respond(ctx.locales.JOIN_VC, true);

    if (
      serverListener &&
      serverListener?.listening &&
      ctx.author?.voice?.channel?.id != ctx.guild?.me?.voice?.channel?.id
    ) {
      ctx.respond(ctx.locales.NOT_SAME_VC, true);
      return false;
    }

    try {
      ctx.client.player.playSong(
        ctx.guild.id,
        {
          voice: ctx.author.voice.channel.id,
          text: ctx.channel.id,
        },
        ctx.guild.voiceAdapterCreator,
        ctx.locales,
        song
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
  async (ctx: CommandContext): Promise<boolean> => {
    if (!ctx?.guild?.me?.voice?.channel) {
      ctx.respond(ctx.locales.NOT_IN_VC, true);
      return false;
    }

    if (ctx.author?.voice?.channel?.id != ctx.guild?.me?.voice?.channel?.id) {
      ctx.respond(ctx.locales.NOT_SAME_VC, true);
      return false;
    }

    ctx.client.player.destroyStream(ctx.guild.id);

    ctx.respond("👍");

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
  async (ctx: CommandContext): Promise<boolean> => {
    if (!ctx.client.player.isPlaying(ctx.guild.id)) {
      ctx.respond(ctx.locales.NOT_PLAYING, true);
      return false;
    }

    if (ctx.author?.voice?.channel?.id != ctx.guild?.me?.voice?.channel?.id) {
      ctx.respond(ctx.locales.NOT_SAME_VC, true);
      return false;
    }

    let songAmount = ctx.args[0] as any;

    if (!songAmount || isNaN(songAmount)) songAmount = 1;

    const isOk = await ctx.client.player.skipSong(ctx.guild.id, songAmount);

    if (!isOk) {
      ctx.client.player.destroyStream(ctx.guild.id);
      ctx.respond(ctx.locales.EMPTY_SONG_QUEUE, true);
      return true;
    } else {
    }

    ctx.respond(ctx.locales.SKIPPING_SONG.replace("$count", songAmount));

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
  async (ctx: CommandContext): Promise<boolean> => {
    if (!ctx.client.player.isPlaying(ctx.guild.id)) {
      ctx.respond(ctx.locales.NOT_PLAYING, true);
      return false;
    }

    if (ctx.author?.voice?.channel?.id != ctx.guild?.me?.voice?.channel?.id) {
      ctx.respond(ctx.locales.NOT_SAME_VC, true);
      return false;
    }

    const guild = ctx.client.player.listeners.get(ctx.guild.id);

    if (!guild) {
      ctx.respond(ctx.locales.QUEUE_NOT_FOUND, true);
      return false;
    }

    let queue: string[] = [];

    for (var i = 0; i < guild.queue.length; i++) {
      queue.push(
        `${i + 1} - [${guild.queue[i].title}](${guild.queue[i].url}) ${
          i == 0 ? `- **${ctx.locales.CURRENTLY_PLAYING}**` : ""
        }`
      );
    }

    const queueEmbed = new MessageEmbed();

    queueEmbed
      .setColor("#5865F2")
      .setTitle(`${ctx.guild.name} - ${ctx.locales.SONG_QUEUE}`)
      .setDescription(queue.join("\n"));

    ctx.respond(queueEmbed);

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
  async (ctx: CommandContext): Promise<boolean> => {
    if (!ctx.client.player.isPlaying(ctx.guild.id)) {
      ctx.respond(ctx.locales.NOT_PLAYING, true);
      return false;
    }

    if (ctx.author?.voice?.channel?.id != ctx.guild?.me?.voice?.channel?.id) {
      ctx.respond(ctx.locales.NOT_SAME_VC, true);
      return false;
    }

    const isOk = await ctx.client.player.pauseStream(ctx.guild.id);

    if (isOk) {
      ctx.respond("👍");
    } else {
      ctx.respond(ctx.locales.ERROR, true);
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
  async (ctx: CommandContext): Promise<boolean> => {
    if (!ctx.client.player.isPlaying(ctx.guild.id)) {
      ctx.respond(ctx.locales.NOT_PLAYING, true);
      return false;
    }

    if (ctx.author?.voice?.channel?.id != ctx.guild?.me?.voice?.channel?.id) {
      ctx.respond(ctx.locales.NOT_SAME_VC, true);
      return false;
    }

    const isOk = await ctx.client.player.resumeStream(ctx.guild.id);

    if (isOk) {
      ctx.respond("👍");
    } else {
      ctx.respond(ctx.locales.ERROR, true);
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
  async (ctx: CommandContext): Promise<boolean> => {
    if (!ctx.client.player.isPlaying(ctx.guild.id)) {
      ctx.respond(ctx.locales.NOT_PLAYING, true);
      return false;
    }

    if (ctx.author?.voice?.channel?.id != ctx.guild?.me?.voice?.channel?.id) {
      ctx.respond(ctx.locales.NOT_SAME_VC, true);
      return false;
    }

    const guild = ctx.client.player.listeners.get(ctx.guild.id);

    if (!guild) {
      ctx.respond(ctx.locales.QUEUE_NOT_FOUND, true);
      return false;
    }

    if (guild.loop) {
      guild.loop = false;
      ctx.respond(ctx.locales.LOOP_DISABLED, true);
    } else {
      guild.loop = true;
      ctx.respond(ctx.locales.LOOP_ENABLED, true);
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
  async (ctx: CommandContext): Promise<boolean> => {
    if (!ctx.args[0] || isNaN(ctx.args[0] as any))
      return ctx.respond(ctx.locales.WRONG_COMMAND_USAGE);

    if (!ctx.client.player.isPlaying(ctx.guild.id)) {
      ctx.respond(ctx.locales.NOT_PLAYING, true);
      return false;
    }

    if (ctx.author?.voice?.channel?.id != ctx.guild?.me?.voice?.channel?.id) {
      ctx.respond(ctx.locales.NOT_SAME_VC, true);
      return false;
    }

    const guild = ctx.client.player.listeners.get(ctx.guild.id);

    if (!guild) {
      ctx.respond(ctx.locales.QUEUE_NOT_FOUND, true);
      return false;
    }

    const isOk = await ctx.client.player.delSongFromQueue(
      ctx.guild.id,
      ctx.args[0] as any
    );

    if (isOk) {
      ctx.respond(ctx.locales.SUCCESS, true);
      return true;
    }

    ctx.respond(ctx.locales.ERROR, true);

    return true;
  }
);

export const lyrics = new Command(
  "lyrics",
  [],
  "Shows the lyrics of the given or currenty listened song.",
  [
    {
      type: "STRING",
      name: "song",
      description: "Song title or song artist to search",
      required: false,
    },
  ],
  8,
  [],
  [Permissions.SEND_MESSAGES, Permissions.EMBED_LINKS],
  async (ctx: CommandContext): Promise<boolean> => {
    const player = ctx.client.player.listeners.get(ctx.guild.id);
    let searchQuery = ctx.args.join(" ").trim();

    if (!searchQuery) {
      if (player?.listening) {
        searchQuery = player.queue[0].title;
      } else {
        ctx.respond(ctx.locales.WRONG_COMMAND_USAGE);

        return false;
      }
    }

    const songLyrics = await ctx.client.player.getLyrics(
      searchQuery.replace(
        /[!%&'()*+./;<=>?\\,/:#@\t\r\n"\[\]_\u007B-\u00BF-]/g,
        ""
      )
    );

    if (!songLyrics) {
      ctx.respond(ctx.locales.LYRIC_NOT_FOUND);

      return false;
    }

    // TODO: Split embeds if lyric contenet is longer than 2048
    const lyricsEmbed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle(songLyrics.title)
      .setThumbnail(songLyrics.thumbnail)
      .setDescription(`**${songLyrics.content}**`);

    ctx.respond(lyricsEmbed);

    return true;
  }
);
