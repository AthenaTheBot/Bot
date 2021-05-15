const { MessageEmbed } = require('discord.js');
const Embed = new MessageEmbed();

module.exports = {
    name: 'guildDelete',
    async run(base, guild) {

        try {
            await base.db.collection('servers').deleteOne({ guild: guild.id });
        } catch (err) {
            base.log('error', `${err} (Guild: ${guild.id})`);
        }
    
        return base.channels.cache.get(base.config.channels.GUILD).send(Embed.setColor('RED').setDescription(`**Guild Name**: \n ${guild.name} | \`${guild.id}\` \n \n **Member Count**: \n \`${guild.memberCount}\` \n \n **Owner ID**: \n \`${guild.ownerID}\` `).setThumbnail(guild.bannerURL({ size: 4096, format: 'png', dynamic: true })).setTimestamp()).catch(err => {
            base.log('error', `${err} (Guild: ${guild.id})`);
        });
    }

}