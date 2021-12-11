import { CommandManager, CommandData } from "../Classes/CommandManager";
import { Permissions } from "../Classes/PermissionResolver";

// TODO Commands: kick, ban, slowmode, warn, delwarn, setwarn?

export default (commandManager: CommandManager) => {
  commandManager.registerCommand(
    "kick",
    [],
    "Kicks the specified user from guild.",
    [],
    4,
    [],
    [
      Permissions.SEND_MESSAGES,
      Permissions.EMBED_LINKS,
      Permissions.KICK_MEMBERS,
    ],
    (commandData: CommandData): boolean => {
      commandData.respond("Executed!");

      return true;
    }
  );
};
