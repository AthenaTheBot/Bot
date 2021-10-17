import AthenaClient from "../AthenaClient";

class Command {
  name: string;
  aliases: string[];
  description: string;
  usage: string | null;
  cooldown: number;
  requiredPerms: string[];
  requiredBotPerms: string[];
  exec: (client: AthenaClient, data: any) => boolean;

  constructor(
    name: string,
    aliases: string[],
    description: string,
    usage: string | null,
    cooldown: number,
    requiredPerms: string[],
    requiredBotPerms: string[],
    exec: (client: AthenaClient, data: any) => boolean
  ) {
    this.name = name;
    this.aliases = aliases;
    this.description = description;
    this.usage = usage;
    this.cooldown = cooldown;
    this.requiredPerms = requiredPerms;
    this.requiredBotPerms = requiredBotPerms;

    this.exec = exec;
  }
}

export default Command;
