const run = async (client, message, args, locale) => {

    // Variables
    const { MessageEmbed } = require('discord.js');

    const errorEmbed = new MessageEmbed().setColor('RED');
    const alertEmbed = new MessageEmbed().setColor('YELLOW');
    const successEmbed = new MessageEmbed().setColor('GREEN');
    const defaultEmbed = new MessageEmbed().setColor(client.branding.colors.default);

    const mentionedMember = message.mentions.users.first();
    let reason = args.slice(1).join(' ')

    if (!mentionedMember) return message.channel.send(errorEmbed.setDescription(`${client.branding.emojis.error} ${locale.NO_MENTION}`));

    if (mentionedMember.id === message.author.id) return message.channel.send(errorEmbed.setDescription(`${client.branding.emojis.error} ${locale.CANNOT_KICK_YOURSELF}`));

    if (mentionedMember.id === client.user.id) return message.channel.send(errorEmbed.setDescription(`${client.branding.emojis.error} ${locale.CANNOT_KICK_MYSELF}`));

    let rawPos1;
    if (!message.member.roles) rawPos1 = 0;
    else rawPos1 = message.member.roles.highest.rawPosition;

    let rawPos2;
    if (!mentionedMember.roles) rawPos2 = 0;
    else rawPos2 = mentionedMember.roles.highest.rawPosition;

    let rawPos3;
    if (!message.guild.me.roles) rawPos3 = 0;
    else rawPos3 = message.guild.me.roles.highest.rawPosition;

    if (mentionedMember.id === message.guild.ownerID) return message.channel.send(errorEmbed.setDescription(`${client.branding.emojis.error} ${locale.NOT_ENOUGH_PERMS}`));

    if (rawPos1 > rawPos2 || message.author.id === message.guild.ownerID) {

        if (rawPos3 < rawPos2) return message.channel.send(alertEmbed.setDescription(`${client.branding.emojis.alert} ${locale.BOT_NOT_ENOUGH_PERMS}`));

        if (!reason) reason = locale.NO_REASON;

        locale = JSON.parse(JSON.stringify(locale).replace('$reason', reason));

        try {
            message.guild.members.cache.get(mentionedMember.id).kick(reason)
        } catch (err) {
            return message.channel.send(errorEmbed.setDescription(`${client.branding.emojis.error} ${locale.ERROR_MSG}`));
        }

        message.channel.send(successEmbed.setDescription(`${client.branding.emojis.success} **${mentionedMember.username}#${mentionedMember.discriminator}**, ${locale.SUCCESSFUL}`));

        return client.users.cache.get(mentionedMember.id).send(defaultEmbed.setDescription(locale.YOU_HAVE_BEEN_KICKED));

    } else {

        return message.channel.send(errorEmbed.setDescription(`${client.branding.emojis.error} ${locale.NOT_ENOUGH_PERMS}`));
    }

}

module.exports = {
    Name: 'kick', 
    Aliases: ['at'],
    Category: 'Moderation',
    Description: 'Simple kick comamnd.',
    Cooldown: 1,
    Usage: '@member reason',
    RequiredPerms: ["KICK_MEMBERS"],
    RequiredBotPerms: ["KICK_MEMBERS", "SEND_MESSAGES", "EMBED_LINKS"],
    Run: run
}