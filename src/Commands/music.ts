import CommandManager from "../Classes/CommandManager";

export default (commandManager: CommandManager) => {
  commandManager.registerCommand(
    "play",
    ["p"],
    "Play song in a voice channel.",
    [],
    4,
    [],
    ["SEND_MESSAGES"],
    async (client, data, args): Promise<boolean> => {
      const song = args.join(" ");
      if (song.length === 0) return false;

      const res = await client.player.searchSong(args.join(" "));

      return true;
    }
  );
};
