import { GuildMember, MessageEmbed, Role, TextChannel } from "discord.js";
import ErrorHandler from "../Modules/ErrorHandler";
import Event from "../Structures/Event";

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
        member.roles.add(role).catch(ErrorHandler.handleError);
      }
    }

    if (welcomeMessage?.enabled && welcomeMessage?.channel) {
      const embed = new MessageEmbed(
        JSON.parse(
          JSON.stringify(welcomeMessage?.message?.embed)
            ?.replaceAll("$user", member.user.username)
            ?.replaceAll("$server", member.guild.name)
        ) as any
      );
      const channel = member.guild.channels.cache.get(
        welcomeMessage.channel
      ) as TextChannel;

      if (channel) {
        channel
          .send({
            embeds: [embed],
          })
          .catch(ErrorHandler.handleError);
      }
    }

    return true;
  }
);
