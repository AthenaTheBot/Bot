const run = async (client, message, args, locale, db) => {

    // Variables
    const { MessageEmbed } = require('discord.js');
    
    const errorEmbed = new MessageEmbed().setColor('RED');
    const alertEmbed = new MessageEmbed().setColor('YELLOW');
    const successEmbed = new MessageEmbed().setColor('GREEN');
    const defaultEmbed = new MessageEmbed().setColor(client.branding.colors.default);

    const mention = message.mentions.users.first();

    if (!args[0]) return message.channel.send(errorEmbed.setDescription(`${client.branding.emojis.error} ${locale.INVALID_MEMBER}`))

    let targetID;
    if (mention) targetID = mention.id;
    else {
        let mem = message.guild.members.cache.get(args[0]);
        if (!mem || mem === undefined || mem === null) return message.channel.send(errorEmbed.setDescription(`${client.branding.emojis.error} ${locale.INVALID_MEMBER}`));
        else targetID = mem.id;
    } 

    const target = message.guild.members.cache.get(targetID);

    if (targetID === message.author.id) return message.channel.send(errorEmbed.setDescription(`${client.branding.emojis.error} ${locale.CANNOT_WARN_YOURSELF}`));

    if (targetID === client.user.id) return message.channel.send(errorEmbed.setDescription(`${client.branding.emojis.error} ${locale.CANNOT_WARN_MYSELF}`));

    if (message.member.roles.highest.rawPosition > target.roles.highest.rawPosition || message.author.id === message.guild.ownerID) {

        if (message.guild.me.roles.highest.rawPosition > target.roles.highest.rawPosition ) {

            const guildData = await db.manager.getGuild(message.guild);
            let targetWarnings = guildData.data.moderationModule.warnings.filter(x => x.id === targetID);

            if (!targetWarnings[0] || targetWarnings[0] === undefined || targetWarnings[0] === null) {
                try {
                    await db.manager.setValue({ collection: 'servers', query: { _id: message.guild.id }, operation: { $push: { "data.moderationModule.warnings": { id: targetID, count: 0 } } } });
                } catch (err) {
                    return client.handleError({ commandName: module.exports.Name, channelID: message.channel.id, msg: locale.ERROR_MSG, error: err });
                }
                targetWarnings[0] = { id: targetID, count: 0 };
            }

            const newWarnCount = targetWarnings[0].count + 1

            locale = JSON.parse(JSON.stringify(locale).replace(/_user/g, target.user.username).replace(/_count/g, newWarnCount));

            try {
                await db.manager.setValue({ collection: 'servers', query: { _id: message.guild.id, "data.moderationModule.warnings.id": targetID }, operation: { $set: { "data.moderationModule.warnings.$.count": newWarnCount }} });
            } catch (err) {
                return client.handleError({ commandName: module.exports.Name, channelID: message.channel.id, msg: locale.ERROR_MSG, error: err });
            }

            if (newWarnCount === 3) {
                try {
                    target.kick();
                } catch (err) {
                    return message.channel.send(errorEmbed.setDescription(locale.KICK_ERROR));
                }

                locale = JSON.parse(JSON.stringify(locale).replace('$count', 3));

                return message.channel.send(successEmbed.setDescription(`${client.branding.emojis.success} ${locale.KICKED}`));
            }

            if (newWarnCount >= 5) {
                try {
                    target.ban();
                } catch (err) {
                    return message.channel.send(errorEmbed.setDescription(locale.BAN_ERROR));
                }

                try {
                    await db.manager.setValue({ collection: 'servers', query: { _id: message.guild.id }, operation: { $pull: { "data.moderationModule.warnings": { id: targetID } } } });
                } catch (err) {
                    return client.handleError({ commandName: module.exports.Name, channelID: message.channel.id, msg: locale.ERROR_MSG, error: err });
                }

                return message.channel.send(successEmbed.setDescription(`${client.branding.emojis.success} ${locale.BANNED}`));
            }


            return message.channel.send(successEmbed.setDescription(`${client.branding.emojis.success} ${locale.WARNED}`));


        } else {
            return message.channel.send(alertEmbed.setDescription(`${client.branding.emojis.alert} ${locale.BOT_NOT_ENOUGH_PERMS}`));
        }

    } else {

        return message.channel.send(errorEmbed.setDescription(`${client.branding.emojis.error} ${locale.NOT_ENOUGH_PERMS}`))
    }
}

module.exports = {
    Name: 'warn', 
    Aliases: ['uyar'],
    Category: 'Moderation',
    Description: 'Simple warn command.',
    Cooldown: 1,
    Usage: '@member reason',
    RequiredPerms: ["ADMINISTRATOR"],
    RequiredBotPerms: ["KICK_MEMBERS", "BAN_MEMBERS", "SEND_MESSAGES", "EMBED_LINKS"],
    Run: run
}