import { ApplicationCommandOptionData } from "discord.js";
import { CommandData } from "./CommandData";
import { PermissionResolver, Permissions } from "./PermissionResolver";

class Command {
  name: string;
  aliases: string[];
  description: string;
  options: ApplicationCommandOptionData[];
  cooldown: number;
  requiredPerms: PermissionResolver;
  requiredBotPerms: PermissionResolver;
  exec: (commandData: CommandData) => boolean | Promise<boolean>;

  constructor(
    name: string,
    aliases: string[],
    description: string,
    options: ApplicationCommandOptionData[],
    cooldown: number,
    requiredPerms: Permissions[],
    requiredBotPerms: Permissions[],
    exec: (commandData: CommandData) => boolean | Promise<boolean>
  ) {
    this.name = name;
    this.aliases = aliases;
    this.description = description;
    this.options = options;
    this.cooldown = cooldown;
    this.requiredPerms = new PermissionResolver(requiredPerms);
    this.requiredBotPerms = new PermissionResolver(requiredBotPerms);

    this.exec = exec;
  }
}

export default Command;
