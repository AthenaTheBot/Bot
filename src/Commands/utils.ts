import CommandManager from "../Classes/CommandManager";

export default (commandManager: CommandManager) => {
  commandManager.registerCommand(
    "ping",
    [],
    "Simple ping pong command whether to check bot is online or not.",
    [],
    4,
    [],
    ["SEND_MESSAGES"],
    (client, data, args): boolean => {
      try {
        data.reply("Pong!");
      } catch (err) {
        return false;
      }
      return true;
    }
  );
};
