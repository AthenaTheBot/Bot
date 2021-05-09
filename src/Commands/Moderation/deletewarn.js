const run = async (client, message, args, locale, db) => {

    // Variables
    const { MessageEmbed } = require('discord.js');
    
    const errorEmbed = new MessageEmbed().setColor('RED');
    const alertEmbed = new MessageEmbed().setColor('YELLOW');
    const successEmbed = new MessageEmbed().setColor('GREEN');
    const defaultEmbed = new MessageEmbed().setColor(client.branding.colors.default);

    const mention = message.mentions.users.first();

    if (!args[0]) return message.channel.send(errorEmbed.setDescription(`${client.branding.emojis.error} ${locale.INVALID_USER}`));

    let targetID;
    if (mention) targetID = mention.id
    else {
        let mem = message.guild.members.cache.get(args[0]);
        if (!mem || mem === undefined || mem === null) return message.channel.send(errorEmbed.setDescription(`${client.branding.emojis.error} ${locale.INVALID_USER}`));
        else targetID = mem.id
    }

    try {
        await db.manager.setValue({ collection: 'servers', query: { _id: message.guild.id }, operation: { $pull: { "data.moderationModule.warnings": { id: targetID } } } });
    }
    catch (err) {
        return client.handleError({ commandName: module.exports.Name, channelID: message.channel.id, msg: locale.ERROR_MSG, error: err });
    }

    const target = message.guild.members.cache.get(targetID);

    locale = JSON.parse(JSON.stringify(locale).replace('$user', target.user.username));

    return message.channel.send(successEmbed.setDescription(`${client.branding.emojis.success} ${locale.REMOVED_WARNINGS}`));

}

module.exports = {
    Name: 'deletewarn', 
    Aliases: ['delwarn', 'uyarısil', "uyarisil", "removewarnings", "remvoewarn"],
    Category: 'Moderation',
    Description: 'Deletes the warnings of mentioned member.',
    Cooldown: 1,
    Usage: '@member',
    RequiredPerms: ["ADMINISTRATOR"],
    RequiredBotPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    Run: run
}
