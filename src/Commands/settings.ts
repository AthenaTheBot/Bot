import CommandManager from "../Classes/CommandManager";
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
    async (client, data, args): Promise<boolean> => {
      // Initalizing embed object
      const Embed = new MessageEmbed().setColor("AQUA");

      // If there is no arguement specified send the current prefix else set prefix.
      if (args.length === 0) {
        try {
          data.reply({
            embeds: [
              Embed.setDescription(
                "My current command prefix is: `" +
                  data.guild.data.settings.prefix +
                  "`"
              ),
            ],
          });
        } catch (err) {
          return false;
        }
        return true;
      } else {
        const success = await client.dbManager.updateDocument(
          "guilds",
          data.guild.id,
          { $set: { "settings.prefix": args[0] } }
        );

        if (success) {
          data.reply({
            embeds: [
              Embed.setDescription(
                "Successfully set server prefix as `" + args[0] + "`"
              ),
            ],
          });
        } else {
          data.reply({
            embeds: [
              Embed.setColor("RED").setDescription(
                "An error occured while trying to set server prefix"
              ),
            ],
          });
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
    async (client, data, args): Promise<boolean> => {
      let mentionedRole;
      if (data.isInteraction) {
      } else {
        mentionedRole = data.mentions.roles.first();
      }

      if (!mentionedRole?.id)
        return data.reply({
          embeds: [
            new MessageEmbed()
              .setColor("RED")
              .setDescription("Please specify a valid role."),
          ],
        });

      const success = await client.guildManager.updateGuild(data.guild.id, {
        $set: { "modules.moderationModule.adminRole": mentionedRole.id },
      });

      if (success) {
        data.reply({
          embeds: [
            new MessageEmbed()
              .setColor("GREEN")
              .setDescription(
                `Successfully set admin role as <@&${mentionedRole.id}>`
              ),
          ],
        });
      } else {
        return data.reply({
          embeds: [
            new MessageEmbed()
              .setColor("RED")
              .setDescription(
                "An unexpected error occured while updating admin role, please try again in a minute."
              ),
          ],
        });
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
    async (client, data, args): Promise<boolean> => {
      let mentionedRole;
      if (data.isInteraction) {
      } else {
        mentionedRole = data.mentions.roles.first();
      }

      if (!mentionedRole?.id)
        return data.reply({
          embeds: [
            new MessageEmbed()
              .setColor("RED")
              .setDescription("Please specify a valid role."),
          ],
        });

      const success = await client.guildManager.updateGuild(data.guild.id, {
        $set: { "modules.moderationModule.modRole": mentionedRole.id },
      });

      if (success) {
        data.reply({
          embeds: [
            new MessageEmbed()
              .setColor("GREEN")
              .setDescription(
                `Successfully set mod role as <@&${mentionedRole.id}>`
              ),
          ],
        });
      } else {
        return data.reply({
          embeds: [
            new MessageEmbed()
              .setColor("RED")
              .setDescription(
                "An unexpected error occured while updating admin role, please try again in a minute."
              ),
          ],
        });
      }

      return true;
    }
  );
};
