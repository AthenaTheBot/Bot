import { CommandManager, CommandData } from "../Classes/CommandManager";
import { getVoiceConnection } from "@discordjs/voice";

export default (commandManager: CommandManager) => {
  commandManager.registerCommand(
    "play",
    ["p"],
    "Play song in a voice channel.",
    [],
    4,
    [],
    ["SEND_MESSAGES"],
    async (commandData: CommandData): Promise<boolean> => {
      const songRequest = commandData.args.join(" ");

      if (!songRequest) return commandData.respond("Error! no song query");

      const song = await commandData.client.player.searchSong(songRequest);

      if (!song) return commandData.respond("Song not found!");

      const serverListener = commandData.client.player.listeners.get(
        commandData.guild.id
      );

      if (!commandData?.author?.voice?.channel?.id)
        return commandData.respond("Join a voice channel");

      if (serverListener && serverListener?.listening) {
        serverListener.queue.push(song);
        commandData.client.player.listeners.set(
          commandData.guild.id,
          serverListener
        );
        return commandData.respond("Added to queue " + song.title);
      }

      commandData.client.player.serveGuild(
        commandData.guild.id,
        commandData.author.voice.channel.id,
        commandData.channel.id,
        commandData.guild.voiceAdapterCreator,
        song
      );

      commandData.respond("Playing now: " + song.title);

      return true;
    }
  );

  commandManager.registerCommand(
    "disconnect",
    ["dc"],
    "Disconnects from voice channel if exits.",
    [],
    4,
    [],
    ["SEND_MESSAGES"],
    async (commandData: CommandData): Promise<boolean> => {
      const connection = getVoiceConnection(commandData.guild.id);

      connection?.destroy();

      commandData.respond("Ok!");

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
    ["SEND_MESSAGES"],
    async (commandData: CommandData): Promise<boolean> => {
      let songAmount = commandData.args[0] as any;

      if (!songAmount || isNaN(songAmount)) songAmount = 1;

      const isOk = await commandData.client.player.skipSong(
        commandData.guild.id,
        songAmount
      );

      if (!isOk) {
        commandData.client.player.destroyStream(commandData.guild.id);
        return commandData.respond(
          "There isn't any song left to play so leaving from your voice channel."
        );
      } else {
      }

      commandData.respond("Skipping " + songAmount + " song.");

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
    ["SEND_MESSAGES"],
    async (commandData: CommandData): Promise<boolean> => {
      const guild = commandData.client.player.listeners.get(
        commandData.guild.id
      );

      if (!guild) return commandData.respond("Guild not found!");

      console.log(guild.queue);

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
    ["SEND_MESSAGES"],
    async (commandData: CommandData): Promise<boolean> => {
      const isOk = await commandData.client.player.pauseStream(
        commandData.guild.id
      );

      if (isOk) {
        commandData.respond("Ok!");
      } else {
        commandData.respond("Error");
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
    ["SEND_MESSAGES"],
    async (commandData: CommandData): Promise<boolean> => {
      const isOk = await commandData.client.player.resumeStream(
        commandData.guild.id
      );

      if (isOk) {
        commandData.respond("Ok!");
      } else {
        commandData.respond("Error");
      }

      return true;
    }
  );
};
