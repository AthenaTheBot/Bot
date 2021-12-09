import { CommandManager, CommandData } from "../Classes/CommandManager";
import { MessageEmbed } from "discord.js";

export default (commandManager: CommandManager) => {
  // Prefix command
  commandManager.registerCommand(
    "prefix",
    [],
    "Change the prefix of Athena for your server and use the best fit for your server!",
    [
      {
        type: "STRING",
        name: "Prefix",
        description: "The prefix that you want to set",
        required: false,
      },
    ],
    5,
    ["ADMINISTRATOR"],
    ["SEND_MESSAGES", "EMBED_LINKS"],
    async (commandData: CommandData): Promise<boolean> => {
      // If there is no arguement specified send the current prefix else set prefix.
      if (commandData.args.length === 0) {
        try {
          commandData.respond(
            commandData.locales.CURRENT_PREFIX.replace(
              "$prefix",
              commandData.db.guild.settings.prefix
            ),
            true
          );
        } catch (err) {
          return false;
        }

        return true;
      } else {
        const success = await commandData.client.dbManager.updateDocument(
          "guilds",
          commandData.guild.id,
          { $set: { "settings.prefix": commandData.args[0] } }
        );

        if (success) {
          commandData.respond(commandData.locales.SUCCESS, true);
        } else {
          commandData.respond(commandData.locales.ERROR, true);
        }
        return true;
      }
    }
  );

  // Admin role command
  commandManager.registerCommand(
    "adminrole",
    [],
    "Command for setting admin role.",
    [
      {
        type: "ROLE",
        name: "Role",
        description: "The role that you want to set as bot admin.",
        required: true,
      },
    ],
    4,
    ["ADMINISTRATOR"],
    ["EMBED_LINKS"],
    async (commandData): Promise<boolean> => {
      let mentionedRole;

      if (commandData.type === "Interaction") {
        mentionedRole = await commandData.guild.roles.fetch(
          commandData.args[0]
        );
      } else {
        mentionedRole = commandData.raw.mentions.roles.first();
      }

      if (!mentionedRole?.id) {
        commandData.respond(commandData.locales.SPECIFY_ROLE, true);
        return false;
      }

      const success = await commandData.client.guildManager.updateGuild(
        commandData.guild.id,
        {
          $set: { "modules.moderationModule.adminRole": mentionedRole.id },
        }
      );

      if (success) {
        commandData.respond(commandData.locales.SUCCESS, true);
      } else {
        return commandData.respond(commandData.locales.ERROR, true);
      }

      return true;
    }
  );

  // Mod role command
  commandManager.registerCommand(
    "modrole",
    [],
    "Command for setting admin role.",
    [
      {
        type: "ROLE",
        name: "Role",
        description: "The role that you want to set as bot admin.",
        required: true,
      },
    ],
    4,
    ["ADMINISTRATOR"],
    ["EMBED_LINKS"],
    async (commandData: CommandData): Promise<boolean> => {
      let mentionedRole;

      if (commandData.type === "Interaction") {
        mentionedRole = await commandData.guild.roles.fetch(
          commandData.args[0]
        );
      } else {
        mentionedRole = commandData.raw.mentions.roles.first();
      }

      if (!mentionedRole?.id) {
        commandData.respond(commandData.locales.SPECIFY_ROLE, true);
        return false;
      }

      const success = await commandData.client.guildManager.updateGuild(
        commandData.guild.id,
        {
          $set: { "modules.moderationModule.modRole": mentionedRole.id },
        }
      );

      if (success) {
        commandData.respond(commandData.locales.SUCCESS, true);
      } else {
        commandData.respond(commandData.locales.ERROR, true);
        return false;
      }

      return true;
    }
  );
};
