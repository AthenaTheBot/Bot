import { GuildMember, MessageEmbed, Role, TextChannel } from "discord.js";
import Event from "../Structures/Event";
import validator from "validator";

import { WelcomerEmbed } from "../constants";

export default new Event(
  "guildMemberAdd",
  async (client, member: GuildMember): Promise<boolean> => {
    const guildData = await client.guildManager.fetch(member.guild.id, true);
    const autoRole = guildData?.modules?.moderation?.autoRole;
    const welcomeMessage = guildData?.modules?.welcomer?.messageToChannel;

    if (autoRole) {
      const role = member.guild.roles.cache.get(autoRole) as Role;
      const roleClient = member.guild.me?.roles.highest as Role;

      if (roleClient?.rawPosition > role?.rawPosition && !role.managed) {
        member.roles.add(role).catch(() => {});
      }
    }

    // TODO: Check if the url is valid or not.
    if (welcomeMessage?.enabled && welcomeMessage?.channel) {
      const embedData = JSON.parse(
        JSON.stringify(welcomeMessage?.message?.embed)
          ?.replaceAll("$user", member.user.username)
          ?.replaceAll("$server", member.guild.name)
      ) as WelcomerEmbed;

      const embed = new MessageEmbed();

      if (embedData?.author)
        embed.setAuthor({
          iconURL: welcomeMessage.message.embed.author.icon,
          name: welcomeMessage.message.embed.author.name,
          url: welcomeMessage.message.embed.author.url,
        });

      if (embedData?.title) embed.setTitle(embedData?.title);

      if (embedData?.description) embed.setDescription(embedData?.description);

      if (embedData?.thumbnail && validator.isURL(embedData?.thumbnail || ""))
        embed.setThumbnail(embedData.thumbnail);

      if (embedData?.image && validator.isURL(embedData?.image))
        embed.setImage(embedData?.image);

      if (embedData?.url && validator.isURL(embedData?.url))
        embed.setURL(embedData?.url);

      if (embedData?.color) embed.setColor(embedData.color as any);

      const channel = member.guild.channels.cache.get(
        welcomeMessage.channel
      ) as TextChannel;

      if (channel) {
        channel
          .send({
            embeds: [embed],
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }

    return true;
  }
);
