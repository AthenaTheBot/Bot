const { MessageEmbed } = require('discord.js');

module.exports = class Event {
    constructor() {
        this.name = 'guildCreate'
    }

    async run(client, guild) {

        const Embed = new MessageEmbed()
        .setColor('GREEN')
        .setDescription(`**Name**: \n ${guild.name} | \`${guild.id}\` \n \n **Member Count**: \n \`${guild.memberCount}\` \n \n **Owner ID**: \n \`${guild.ownerId}\``)
        .setTimestamp();

        client.channels.cache.get(client.config.LOG_CHANNELS.GUILD).send({ embeds: [ Embed ] });
        return;
    }
}