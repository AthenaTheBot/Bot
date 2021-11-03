const { MessageEmbed } = require("discord.js");

module.exports = class Event {
  constructor() {
    this.name = "guildDelete";
  }

  async run(client, guild) {
    const Embed = new MessageEmbed().setColor("RED").setTimestamp();

    client.dbManager.removeDocument("guild", guild.id);

    if (guild.available)
      Embed.setDescription(
        `**Name**: \n ${guild.name} | \`${guild.id}\` \n \n **Member Count**: \n \`${guild.memberCount}\` \n \n **Owner ID**: \n \`${guild.ownerId}\``
      );
    else Embed.setDescription(`Guild ID: ${guild.id}`);

    client.channels.cache
      .get(client.config.LOG_CHANNELS.GUILD)
      .send({ embeds: [Embed] });
    return;
  }
};
