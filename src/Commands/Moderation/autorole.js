const run = async (client, message, args, locale, db) => {

    // Variables
    const { MessageEmbed } = require('discord.js');
    
    const errorEmbed = new MessageEmbed().setColor('RED');
    const alertEmbed = new MessageEmbed().setColor('YELLOW');
    const successEmbed = new MessageEmbed().setColor('GREEN');
    const defaultEmbed = new MessageEmbed().setColor(client.branding.colors.default);

    const mentionedRole = message.mentions.roles.first();

    const guildData = await db.manager.getGuild(message.guild);

    return message.channel.send(errorEmbed.setDescription(locale.UNAVAILABLE));

    if (!mentionedRole) {

        if (args.length !== 0) {

            if (0 === args[0].localeCompare('close', undefined, { sensitivity: 'accent' }) || 0 === args[0].localeCompare('off', undefined, { sensitivity: 'accent' }) || 0 === args[0].localeCompare('disable', undefined, { sensitivity: 'accent' }) || 0 === args[0].localeCompare('kapat', undefined, { sensitivity: 'accent' })) {

                if (guildData.data.moderationModule.autoRole.status === false) return message.channel.send(errorEmbed.setDescription(`${client.branding.emojis.error} ${locale.ALREADY_OFF}`));
    
                try {
                    await db.manager.setValue({ collection: 'servers', query: { _id: message.guild.id }, operation: { $set: { "data.moderationModule.autoRole.status": false } } });
                    await db.manager.setValue({ collection: 'servers', query: { _id: message.guild.id }, operation: { $set: { "data.moderationModule.autoRole.role": "" } } });
                }
                catch (err) {
                    return client.handleError({ commandName: module.exports.Name, channelID: message.channel.id, msg: locale.ERROR_MSG, error: err });
                }
    
                return message.channel.send(successEmbed.setDescription(`${client.branding.emojis.success} ${locale.CLOSED}`));
    
            }

        }

        let msg;
        if (guildData.data.moderationModule.autoRole.status === false) msg = locale.AUTOROLE_CLOSED;
        else {

            locale = JSON.parse(JSON.stringify(locale).replace('$role', `<@&${guildData.data.moderationModule.autoRole.role}>`).replace('$guild', message.guild.name));
            msg = locale.AUTOROLE_GENERAL;
        }

        return message.channel.send(defaultEmbed.setDescription(msg));

    } else {

        if (mentionedRole.rawPosition >= message.guild.me.roles.highest.rawPosition) return message.channel.send(errorEmbed.setDescription(`${client.branding.emojis.error} ${locale.CANNOT_GIVE_THAT_ROLE}`));

        if (mentionedRole.managed) return message.channel.send(errorEmbed.setDescription(`${client.branding.emojis.error} ${locale.CANNOT_GIVE_SERVICE_ROLE}`));
    
        if (mentionedRole.id === guildData.data.moderationModule.autoRole.role) return message.channel.send(errorEmbed.setDescription(`${client.branding.emojis.error} ${locale.SAME_ROLE}`));
    
        try {
            await db.manager.setValue({ collection: 'servers', query: { _id: message.guild.id }, operation: { $set: { "data.moderationModule.autoRole.status": true } } });
            await db.manager.setValue({ collection: 'servers', query: { _id: message.guild.id }, operation: { $set: { "data.moderationModule.autoRole.role": mentionedRole.id } } });
        }
        catch (err) {
            return client.handleError({ commandName: module.exports.Name, channelID: message.channel.id, msg: locale.ERROR_MSG, error: err });
        }
    
        locale = JSON.parse(JSON.stringify(locale).replace('$new_role', `<@&${mentionedRole.id}>`));
    
        return message.channel.send(successEmbed.setDescription(`${client.branding.emojis.success} ${locale.SUCCESS}`));

    }

}

module.exports = {
    Name: 'autorole', 
    Aliases: ['otorol'],
    Category: 'Moderation',
    Description: 'Auto role system',
    Cooldown: 1.5,
    Usage: '@role',
    RequiredPerms: ["ADMINISTRATOR"],
    RequiredBotPerms: ["MANAGE_ROLES", "SEND_MESSAGES", "EMBED_LINKS"],
    Run: run
}
