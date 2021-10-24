import CommandManager from "../Classes/CommandManager";
import { MessageEmbed } from "discord.js";

export default (commandManager: CommandManager) => {
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
        /*
          TODO: Implement dbManager system to guild and user managers.
        */
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
};
