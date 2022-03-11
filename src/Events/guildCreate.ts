import { MessageEmbed, TextChannel } from "discord.js";
import Event from "../Structures/Event";

export default new Event(
  "guildCreate",
  async (client, guild): Promise<boolean> => {
    //if (client.config.debug.enabled) return false;

    client.guildManager.create(guild.id);

    const guildLogChannel =
      ((await client.channels.cache.get(
        client.config.log.guild
      )) as TextChannel) ||
      ((await client.channels.fetch(client.config.log.guild)) as TextChannel);

    if (guildLogChannel) {
      const guildLogEmbed = new MessageEmbed()
        .setColor(client.config.colors.success as any)
        .setFields([
          {
            name: "Id",
            value: `\`${guild?.id || "Not Available"}\``,
            inline: false,
          },
          {
            name: "Name",
            value: `\`${guild?.name || "Not Available"}\``,
            inline: false,
          },
          {
            name: "Member Count",
            value: `\`${guild?.memberCount || "Not Available"}\``,
            inline: false,
          },
          {
            name: "Owner Id",
            value: `\`${guild?.ownerId || "Not Available"}\``,
            inline: false,
          },
        ])
        .setTimestamp();

      guildLogChannel?.send({ embeds: [guildLogEmbed] }).catch((err) => {});
    }

    return true;
  }
);
