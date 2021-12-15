import Event from "../Classes/Event";

export default new Event(
  "guildDelete",
  async (client, guild): Promise<boolean> => {
    if (client.config.debugMode) return false;

    client.actionLogger.logGuild(
      guild.id,
      guild.name,
      guild.memberCount,
      guild.ownerId,
      false
    );

    return true;
  }
);
