import { CommandManager, CommandData } from "../Classes/CommandManager";

export default (commandManager: CommandManager) => {
  commandManager.registerCommand(
    "ping",
    [],
    "Simple ping pong command whether to check bot is online or not.",
    [],
    4,
    [],
    ["SEND_MESSAGES"],
    (commandData: CommandData): boolean => {
      commandData.respond("Pong!");

      return true;
    }
  );
};
