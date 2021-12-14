import Event from "../Classes/Event";

export default new Event(
  "guildCreate",
  async (client, guild): Promise<boolean> => {
    if (client.config.debugMode) return false;

    client.actionLogger.logGuild(
      guild.name,
      guild.id,
      guild.memberCount,
      guild.ownerId,
      true
    );

    return true;
  }
);
