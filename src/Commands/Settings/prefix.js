const run = async (client, message, args, locale, db) => {

    // Variables
    const { MessageEmbed } = require('discord.js');
    
    const errorEmbed = new MessageEmbed().setColor('RED');
    const alertEmbed = new MessageEmbed().setColor('YELLOW');
    const successEmbed = new MessageEmbed().setColor('GREEN');
    const defaultEmbed = new MessageEmbed().setColor(client.branding.colors.default);

    const guildData = await db.manager.getGuild(message.guild)
    
    if (!args[0]) return message.channel.send(defaultEmbed.setDescription(`${locale.CURRENT_PREFIX.replace('$prefix', guildData.data.preferences.prefix).replace('$guild', message.guild.name)}`));

    if (args[0]) {

        try {
            await db.manager.setValue({ collection: 'servers', query: { _id: message.guild.id }, operation: { $set: { "data.preferences.prefix": args[0] } } });

        } catch (err) {
            return client.handleError({ commandName: module.exports.Name, channelID: message.channel.id, msg: locale.ERROR_MSG, error: err });
        }

        return message.channel.send(successEmbed.setDescription(`${client.branding.emojis.success} ${locale.SUCCESS.replace('$new_prefix', args[0])}`));
    }
}

module.exports = {
    Name: 'prefix', 
    Aliases: ['önek', 'ÖNEK', 'onek'],
    Category: 'Settings',
    Description: 'Sets the guild prefix.',
    Cooldown: 1,
    RequiredPerms: ["ADMINISTRATOR"],
    RequiredBotPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    Run: run
}