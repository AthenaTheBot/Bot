import Event from "../Classes/Event";

export default new Event(
  "guildDelete",
  async (client, guild): Promise<boolean> => {
    if (client.config.debugMode) return false;

    client.guildManager.delete(guild.id);

    client.actionLogger.logGuild(
      guild.id,
      guild.name || "guild_not_available",
      guild.memberCount || "guild_not_available",
      guild.ownerId || "guild_not_available",
      false
    );

    return true;
  }
);
