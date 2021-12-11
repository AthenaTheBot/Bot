import { CommandManager, CommandData } from "../Classes/CommandManager";
import { Permissions } from "../Classes/PermissionResolver";

// TODO Commands: afk, ascii, avatar, help, invite

export default (commandManager: CommandManager) => {
  commandManager.registerCommand(
    "ping",
    [],
    "Simple ping pong command whether to check bot is online or not.",
    [],
    4,
    [],
    [Permissions.SEND_MESSAGES],
    (commandData: CommandData): boolean => {
      commandData.respond(commandData.locales.PONG);

      return true;
    }
  );
};
