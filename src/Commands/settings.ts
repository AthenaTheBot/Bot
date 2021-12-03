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
    ["EMBED_LINKS"],
    async (commandData: CommandData): Promise<boolean> => {
      // Initalizing embed object
      const Embed = new MessageEmbed().setColor("AQUA");

      // If there is no arguement specified send the current prefix else set prefix.
      if (commandData.args.length === 0) {
        try {
          commandData.respond(
            Embed.setDescription(
              "My current command prefix is: `" +
                commandData.db.guild.settings.prefix +
                "`"
            )
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
          commandData.respond(
            Embed.setDescription(
              "Successfully set server prefix as `" + commandData.args[0] + "`"
            )
          );
        } else {
          commandData.respond(
            Embed.setColor("RED").setDescription(
              "An error occured while trying to set server prefix"
            )
          );
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

      if (!mentionedRole?.id)
        return commandData.respond(
          new MessageEmbed()
            .setColor("RED")
            .setDescription("Please specify a valid role.")
        );

      const success = await commandData.client.guildManager.updateGuild(
        commandData.guild.id,
        {
          $set: { "modules.moderationModule.adminRole": mentionedRole.id },
        }
      );

      if (success) {
        commandData.respond(
          new MessageEmbed()
            .setColor("GREEN")
            .setDescription(
              `Successfully set admin role as <@&${mentionedRole.id}>`
            )
        );
      } else {
        return commandData.respond(
          new MessageEmbed()
            .setColor("RED")
            .setDescription(
              "An unexpected error occured while updating admin role, please try again in a minute."
            )
        );
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

      if (!mentionedRole?.id)
        return commandData.respond(
          new MessageEmbed()
            .setColor("RED")
            .setDescription("Please specify a valid role.")
        );

      const success = await commandData.client.guildManager.updateGuild(
        commandData.guild.id,
        {
          $set: { "modules.moderationModule.modRole": mentionedRole.id },
        }
      );

      if (success) {
        commandData.respond(
          new MessageEmbed()
            .setColor("GREEN")
            .setDescription(
              `Successfully set mod role as <@&${mentionedRole.id}>`
            )
        );
      } else {
        return commandData.respond(
          new MessageEmbed()
            .setColor("RED")
            .setDescription(
              "An unexpected error occured while updating mod role, please try again in a minute."
            )
        );
      }

      return true;
    }
  );
};
