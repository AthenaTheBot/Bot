import { ApplicationCommandOptionData } from "discord.js";
import CommandContext from "./CommandContext";
import { Permissions } from "../constants";
import PermissionResolver from "../Modules/PermissionResolver";

class Command {
  name: string;
  aliases: string[];
  description: string;
  options: ApplicationCommandOptionData[];
  cooldown: number;
  requiredPerms: PermissionResolver;
  requiredBotPerms: PermissionResolver;
  exec: (ctx: CommandContext) => boolean | Promise<boolean>;

  constructor(
    name: string,
    aliases: string[],
    description: string,
    options: ApplicationCommandOptionData[],
    cooldown: number,
    requiredPerms: Permissions[],
    requiredBotPerms: Permissions[],
    exec: (ctx: CommandContext) => boolean | Promise<boolean>
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
