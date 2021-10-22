// Modules
import { readdirSync } from "fs";
import { join } from "path";

// Classes
import Command from "./Command";
import AthenaClient from "../AthenaClient";

import { ApplicationCommandOptionData } from "discord.js";

class CommandManager {
  client: AthenaClient;
  commands: Command[];

  constructor(client: AthenaClient) {
    this.client = client;
    this.commands = [];
  }

  registerCommand(
    name: string,
    aliases: string[],
    description: string,
    options: ApplicationCommandOptionData[],
    cooldown: number,
    requiredPerms: string[],
    requiredBotPerms: string[],
    exec: (client: AthenaClient, data: any) => boolean
  ) {
    // TODO: Registering system for slash commands.

    if (this.isValidCommand(name)) return;

    this.commands.push(
      new Command(
        name,
        aliases,
        description,
        options,
        cooldown,
        requiredPerms,
        requiredBotPerms,
        exec
      )
    );

    this.client.application?.commands.create({
      name: name,
      description: description,
      type: "CHAT_INPUT",
      options: options,
      defaultPermission: requiredPerms.length == 0 ? true : false,
    });
  }

  async registerCommandsFromCommandFolder(): Promise<object> {
    const commandFiles = await readdirSync(
      join(__dirname, "..", "Commands"),
      "utf-8"
    );
    for (var i = 0; i < commandFiles.length; i++) {
      const commandsFile = commandFiles[i];
      const commands = await import(
        join(__dirname, "..", "Commands", commandsFile)
      ).then((x) => {
        if (typeof x?.default !== "function") return null;
        else return x.default;
      });

      if (commands) commands(this);
    }
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

  getCommand(cmdName: string): Command | null {
    return <Command>this.commands.find((x) => x.name == cmdName) || null;
  }
}

export default CommandManager;
