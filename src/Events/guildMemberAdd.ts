import { GuildMember, Role } from "discord.js";
import Event from "../Structures/Event";

export default new Event(
  "guildMemberAdd",
  async (client, member: GuildMember): Promise<boolean> => {
    const guildData = await client.guildManager.fetch(member.guild.id, true);
    const autoRole = guildData?.modules?.moderationModule?.autoRole;

    if (autoRole) {
      const role = member.guild.roles.cache.get(autoRole) as Role;
      const roleClient = member.guild.me?.roles.highest as Role;

      if (roleClient?.rawPosition > role?.rawPosition && !role.managed) {
        member.roles.add(role).catch((err) => {});
      }
    }

    return true;
  }
);
