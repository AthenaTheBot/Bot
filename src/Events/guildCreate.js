const { MessageEmbed } = require('discord.js');
const Embed = new MessageEmbed();

module.exports = {
    name: 'guildCreate',
    async run(base, guild) {

        if (base.config.bot.CLIENT_ID != base.user.id) return;

        try {
            await base.db.manager.createGuild(guild.id);
        } catch (err) {
            base.log('error', `${err} (Guild: ${guild.id})`.red);
        }
    
        return base.channels.cache.get(base.config.channels.GUILD).send(Embed.setColor('GREEN').setDescription(`**Guild Name**: \n ${guild.name} | \`${guild.id}\` \n \n **Member Count**: \n \`${guild.memberCount}\` \n \n **Owner ID**: \n \`${guild.ownerID}\` `).setThumbnail(guild.bannerURL({ size: 4096, format: 'png', dynamic: true })).setTimestamp()).catch(err => {
            base.log('error', `${err} (Guild: ${guild.id})`.red);
        });
    }
}