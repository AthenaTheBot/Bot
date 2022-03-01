import Event from "../Structures/Event";

export default new Event(
  "guildCreate",
  async (client, guild): Promise<boolean> => {
    if (client.config.debugMode) return false;

    client.guildManager.create(guild.id);

    client.actionLogger.logGuild(
      guild.id,
      guild.name,
      guild.memberCount,
      guild.ownerId,
      true
    );

    return true;
  }
);
