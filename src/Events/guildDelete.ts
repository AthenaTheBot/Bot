import Event from "../Classes/Event";

export default new Event(
  "guildDelete",
  async (client, guild): Promise<boolean> => {
    if (client.config.debugMode) return false;

    client.actionLogger.logGuild(
      guild.name,
      guild.id,
      guild.memberCount,
      guild.ownerId,
      false
    );

    return true;
  }
);
