import { CommandManager, CommandData } from "../Classes/CommandManager";
import { Permissions } from "../Classes/PermissionResolver";

// TODO Commands: delsong

export default (commandManager: CommandManager) => {
  commandManager.registerCommand(
    "play",
    ["p"],
    "Play song in a voice channel.",
    [],
    4,
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

      commandData.respond(
        commandData.locales.NOW_PLAYING.replace(
          "$song_title",
          song.title
        ).replace("$song_url", song.url),
        true
      );

      try {
        await commandData.client.player.serveGuild(
          commandData.guild.id,
          commandData.author.voice.channel.id,
          commandData.channel.id,
          commandData.guild.voiceAdapterCreator,
          song
        );

        setTimeout(() => {
          if (
            commandData.client.player.listeners.get(commandData.guild.id)
              ?.listening
          )
            return true;
          else {
            commandData.client.player.destroyStream(commandData.guild.id);
          }
        }, 20 * 1000);

        return true;
      } catch (err) {
        commandData.channel.send(commandData.locales.PLAY_ERROR);

        return false;
      }
    }
  );

  commandManager.registerCommand(
    "disconnect",
    ["dc"],
    "Disconnects from voice channel if exits.",
    [],
    4,
    [],
    [Permissions.SEND_MESSAGES],
    async (commandData: CommandData): Promise<boolean> => {
      commandData.client.player.destroyStream(commandData.guild.id);

      commandData.respond("👍");

      return true;
    }
  );

  commandManager.registerCommand(
    "skip",
    ["s"],
    "Skips to another song in the queue.",
    [
      {
        type: "NUMBER",
        name: "Songs amount",
        description: "Songs amount to skip in the queue",
        required: false,
      },
    ],
    4,
    [],
    [Permissions.SEND_MESSAGES],
    async (commandData: CommandData): Promise<boolean> => {
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

  commandManager.registerCommand(
    "queue",
    ["q"],
    "Shows current song queue.",
    [],
    4,
    [],
    [Permissions.SEND_MESSAGES],
    async (commandData: CommandData): Promise<boolean> => {
      const guild = commandData.client.player.listeners.get(
        commandData.guild.id
      );

      if (!guild) {
        commandData.respond(commandData.locales.QUEUE_NOT_FOUND, true);
        return false;
      }

      // TODO: Show queue
      return true;
    }
  );

  commandManager.registerCommand(
    "pause",
    ["p"],
    "Pauses currently playing song.",
    [],
    4,
    [],
    [Permissions.SEND_MESSAGES],
    async (commandData: CommandData): Promise<boolean> => {
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

  commandManager.registerCommand(
    "resume",
    ["rs"],
    "Resumes paused song.",
    [],
    4,
    [],
    [Permissions.SEND_MESSAGES],
    async (commandData: CommandData): Promise<boolean> => {
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
};
