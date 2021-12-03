import { CommandManager, CommandData } from "../Classes/CommandManager";
import {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  StreamType,
  getVoiceConnection,
} from "@discordjs/voice";
import Song from "../Classes/Song";

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
        commandData.guild,
        commandData.author.voice.channel.id,
        commandData.channel.id,
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
};
