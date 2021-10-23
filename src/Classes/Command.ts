import { ApplicationCommandOptionData } from "discord.js";
import AthenaClient from "../AthenaClient";

class Command {
  name: string;
  aliases: string[];
  description: string;
  options: ApplicationCommandOptionData[];
  cooldown: number;
  requiredPerms: string[];
  requiredBotPerms: string[];
  exec: (client: AthenaClient, data: any) => boolean | Promise<boolean>;

  constructor(
    name: string,
    aliases: string[],
    description: string,
    options: ApplicationCommandOptionData[],
    cooldown: number,
    requiredPerms: string[],
    requiredBotPerms: string[],
    exec: (client: AthenaClient, data: any) => boolean | Promise<boolean>
  ) {
    this.name = name;
    this.aliases = aliases;
    this.description = description;
    this.options = options;
    this.cooldown = cooldown;
    this.requiredPerms = requiredPerms;
    this.requiredBotPerms = requiredBotPerms;

    this.exec = exec;
  }
}

export default Command;
