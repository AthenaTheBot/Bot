import Event from "../Classes/Event";

export default new Event(
  "messageCreate",
  async (client, msgData): Promise<boolean> => {
    const guild = await client.guildManager.fetch(msgData.guild.id);
    console.log(guild);
    return true;
  }
);
