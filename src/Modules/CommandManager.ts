// Modules
import { readdirSync } from "fs";
import { join } from "path";

// Classes
import Command from "../Structures/Command";
import AthenaClient from "../AthenaClient";
import CommandData from "../Structures/CommandData";
import { Permissions } from "../constants";

import {
  ApplicationCommand,
  ApplicationCommandDataResolvable,
  ApplicationCommandOptionData,
} from "discord.js";

/**
 * Handles command registirations and command related events.
 */
class CommandManager {
  client: AthenaClient;
  commands: Command[];

  constructor(client: AthenaClient) {
    this.client = client;
    this.commands = [];
  }

  async removeGlobalCommands(): Promise<void> {
    const cachedCommands: ApplicationCommand[] = [];
    (await this.client.application?.commands.fetch())?.forEach((x) =>
      cachedCommands.push(x)
    );

    for (let i = 0; i < cachedCommands.length; i++) {
      await cachedCommands[i].delete().catch((err) => {
        this.client.logger.warn(
          `An error occued while removing a global slash command: ${cachedCommands[i].name}`
        );
      });
    }

    this.client.logger.success("Removed all old slash commands.");
  }

  async registerCommand(
    name: string,
    aliases: string[],
    description: string,
    options: ApplicationCommandOptionData[],
    cooldown: number,
    requiredPerms: Permissions[],
    requiredBotPerms: Permissions[],
    exec: (commandData: CommandData) => boolean | Promise<boolean>
  ): Promise<boolean> {
    if (this.isValidCommand(name)) return false;

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

    const commandPayload: ApplicationCommandDataResolvable = {
      name: name,
      description: description,
      type: "CHAT_INPUT",
      options: options,
      defaultPermission: requiredPerms.length == 0 ? true : false,
    };

    // Replace special characters and spaces with _ to prevent from api errors.
    commandPayload.options?.forEach((option) => {
      option.name = option.name.toLowerCase().replaceAll(/[^a-zA-Z0-9]/g, "_");
    });

    if (this.client.config.debug.enabled) {
      const debugGuild =
        (await this.client.guilds.cache.get(this.client.config.debug.guild)) ||
        (await this.client.guilds.fetch(this.client.config.debug.guild));

      if (debugGuild) {
        const success = await debugGuild.commands
          .create(commandPayload)
          .then(() => true)
          .catch(() => false);

        return success;
      } else return false;
    } else {
      const success = (await this.client.application?.commands
        .create(commandPayload)
        .then(() => true)
        .catch(() => false)) as boolean;

      return success;
    }
  }

  async registerCommandsFromCommandFolder(): Promise<object> {
    const commandFiles = await readdirSync(
      join(__dirname, "..", "Commands"),
      "utf-8"
    );

    for (var i = 0; i < commandFiles.length; i++) {
      const commandsFile = commandFiles[i];
      const commands: Command[] = await import(
        join(__dirname, "..", "Commands", commandsFile)
      )
        .then((exportData) => {
          const commandExportNames = Object.getOwnPropertyNames(
            exportData
          ).filter((x) => x !== "__esModule" && x !== "default");
          const commandExports: Command[] = [];

          commandExportNames.forEach((name) => {
            if (exportData[name] && exportData[name] instanceof Command) {
              commandExports.push(exportData[name]);
            }
          });

          return commandExports;
        })
        .catch((err) => []);

      for (let i = 0; i < commands.length; i++) {
        const command = commands[i];

        this.registerCommand(
          command.name,
          command.aliases,
          command.description,
          command.options,
          command.cooldown,
          command.requiredPerms.convertPermsToIndexNums(
            command.requiredPerms.all
          ),
          command.requiredBotPerms.convertPermsToIndexNums(
            command.requiredBotPerms.all
          ),
          command.exec
        );
      }
    }
    return this.commands;
  }

  removeCommand(cmdName: string) {
    this.commands = this.commands.filter((x) => x.name !== cmdName);
  }

  isValidCommand(cmdName: string) {
    return this.commands.filter(
      (x) => x.name === cmdName || x.aliases.includes(cmdName)
    ).length !== 0
      ? true
      : false;
  }

  getCommand(cmdName: string): Command | null {
    return (
      <Command>(
        this.commands.find(
          (x) => x.name == cmdName || x.aliases.includes(cmdName)
        )
      ) || null
    );
  }
}

export default CommandManager;
export { CommandManager, CommandData };
