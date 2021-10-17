// Classes
import Command from "./Command";
import AthenaClient from "../AthenaClient";

class CommandManager {
  commands: Command[];

  constructor() {
    this.commands = [];
  }

  registerCommand(
    name: string,
    aliases: string[],
    description: string,
    usage: string | null,
    cooldown: number,
    requiredPerms: string[],
    requiredBotPerms: string[],
    exec: (client: AthenaClient, data: any) => boolean
  ) {
    // TODO: Registering system for slash commands.

    this.commands.push(
      new Command(
        name,
        aliases,
        description,
        usage,
        cooldown,
        requiredPerms,
        requiredBotPerms,
        exec
      )
    );
  }

  async registerCommandsFromCommandFolder(): Promise<object> {
    // TODO: Register all commands in command folder.
    return this.commands;
  }

  removeCommand(cmdName: string) {
    this.commands = this.commands.filter((x) => x.name !== cmdName);
  }

  isValidCommand(cmdName: string) {
    return this.commands.filter((x) => x.name === cmdName).length !== 0
      ? true
      : false;
  }
}

export default CommandManager;
