const { MessageEmbed } = require("discord.js");

module.exports = class Event {
  constructor() {
    this.name = "guildCreate";
  }

  async run(client, guild) {
    if (client.config.DEBUG) return;

    const Embed = new MessageEmbed().setColor("GREEN").setTimestamp();

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
