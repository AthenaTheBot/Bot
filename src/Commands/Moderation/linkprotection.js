const run = async (client, message, args, locale, db) => {

    // Variables
    const { MessageEmbed } = require('discord.js');
    
    const errorEmbed = new MessageEmbed().setColor('RED');
    const alertEmbed = new MessageEmbed().setColor('YELLOW');
    const successEmbed = new MessageEmbed().setColor('GREEN');
    const defaultEmbed = new MessageEmbed().setColor(client.branding.colors.default);

    const user = message.mentions.users.first();
    const channel = message.mentions.channels.first();
    let guildData = await db.manager.getGuild(message.guild);

    let msg;
    if (guildData.data.preferences.tips) msg = locale.TIP;
    else msg = '';

    if (!args[0]) {

        let status;
        if (guildData.data.moderationModule.linkProtection.status === false) status = locale.STATUS_OFF;
        else status = locale.STATUS_ON;

        let us = '<@' + guildData.data.moderationModule.linkProtection.whitelist.users.join('>, <@') + '>';
        let ch = '<#' + guildData.data.moderationModule.linkProtection.whitelist.channels.join('>, <#') + '>';

        if (!us || us === '<@>') us = locale.NO_USERS_IN_WL;
        if (!ch || ch === '<#>') ch = locale.NO_CHANNELS_IN_WL;

        defaultEmbed
        .setDescription(`**${message.guild.name}** | ${locale.MENU_TITLE} \n ──────────────────── \n ${locale.MENU_DESC}: \n ${status} \n \n ${locale.MENU_DESC_2}: \n ${us} \n \n ${locale.MENU_DESC_3}: \n ${ch}`)
        return message.channel.send(msg, defaultEmbed);

    }

    if (args[0] === 'on' || args[0] === 'enable' || args[0] === 'aç') {

        if (guildData.data.moderationModule.linkProtection.status === true) return message.channel.send(errorEmbed.setColor('RED').setDescription(`${client.branding.emojis.error} ${locale.ALREADY_ON}`));

        await db.manager.setValue({ collection: 'servers', query: { _id: message.guild.id }, operation: { $set: { "data.moderationModule.linkProtection.status": true } } });

        return message.channel.send(successEmbed.setColor('GREEN').setDescription(`${client.branding.emojis.success} ${locale.LP_ENABLED}`));

    }

    if (args[0] === 'close' || args[0] === 'kapat') {

        if (guildData.data.moderationModule.linkProtection.status === false) return message.channel.send(errorEmbed.setColor('RED').setDescription(`${client.branding.emojis.error} ${locale.ALREADY_OFF}`));

        await db.manager.setValue({ collection: 'servers', query: { _id: message.guild.id }, operation: { $set: { "data.moderationModule.linkProtection.status": false } } });

        return message.channel.send(successEmbed.setColor('GREEN').setDescription(`${client.branding.emojis.success} ${locale.LP_CLOSED}`));

    }

    if (args[0] === 'whitelist' || args[0] === 'beyazliste') {

        if (guildData.data.moderationModule.linkProtection.status === false) return message.channel.send(errorEmbed.setColor('RED').setDescription(`${client.branding.emojis.error} ${locale.NEED_TO_OPEN_LP}`));

        if (args[1] === 'channel' || args[1] === 'kanal') {

            if (args[2] === 'add' || args[2] === 'ekle') {

                if (!channel) return message.channel.send(errorEmbed.setColor('RED').setDescription(locale.NO_CHANNEL));

                if (guildData.data.moderationModule.linkProtection.whitelist.channels.includes(`<#${channel.id}>`)) return message.channel.send(errorEmbed.setColor('RED').setDescription(`${client.branding.emojis.error} ${locale.ALREADY_IN_WL_CH}`));

                await db.manager.setValue({ collection: 'servers', query: { _id: message.guild.id }, operation: { $push: { "data.moderationModule.linkProtection.whitelist.channels": `${channel.id}` } } });

                return message.channel.send(successEmbed.setColor('GREEN').setDescription(`${client.branding.emojis.success} ${locale.CHANNEL_ADDED_TO_WL}`));
            }

            if (args[2] === 'remove' || args[2] === 'kaldır' || args[2] === 'sil') {

                if (!channel) return message.channel.send(errorEmbed.setColor('RED').setDescription(locale.NO_CHANNEL));

                if (!guildData.data.moderationModule.linkProtection.whitelist.channels.includes(`<#${channel.id}>`)) return message.channel.send(errorEmbed.setColor('RED').setDescription(`${client.branding.emojis.error} ${locale.NOT_IN_WL_CH}`));

                await db.manager.setValue({ collection: 'servers', query: { _id: message.guild.id }, operation: { $pull: { "data.moderationModule.linkProtection.whitelist.channels": `${channel.id}` } } });

                return message.channel.send(successEmbed.setColor('GREEN').setDescription(`${client.branding.emojis.success} ${locale.CHANNEL_DELETED_FROM_WL}`));
            }

        }

        if (args[1] === 'user' || args[1] === 'üye') {

            if (args[2] === 'add' || args[2] === 'ekle') {

                if (!user) return message.channel.send(errorEmbed.setColor('RED').setDescription(locale.NO_USER));

                if (guildData.data.moderationModule.linkProtection.whitelist.users.includes(`<@${user.id}>`)) return message.channel.send(errorEmbed.setColor('RED').setDescription(`${client.branding.emojis.error} ${locale.ALREADY_IN_WL_USER}`))

                await db.manager.setValue({ collection: 'servers', query: { _id: message.guild.id }, operation: { $push: { "data.moderationModule.linkProtection.whitelist.users": `${user.id}` } } });

                return message.channel.send(successEmbed.setColor('GREEN').setDescription(`${client.branding.emojis.success} ${locale.USER_ADDED_TO_WL}`));
            }

            if (args[2] === 'remove' || args[2] === 'sil') {

                if (!user) return message.channel.send(errorEmbed.setColor('RED').setDescription(locale.NO_USER));

                if (!guildData.data.moderationModule.linkProtection.whitelist.users.includes(`<@${user.id}>`)) return message.channel.send(errorEmbed.setColor('RED').setDescription(`${client.branding.emojis.error} ${locale.NOT_IN_WL_USER}`))

                await db.manager.setValue({ collection: 'servers', query: { _id: message.guild.id }, operation: { $pull: { "data.moderationModule.linkProtection.whitelist.users": `${user.id}` } } });

                return message.channel.send(successEmbed.setColor('GREEN').setDescription(`${client.branding.emojis.success} ${locale.USER_REMOVED_FROM_WL}`));
            }

        }

    }

    return message.channel.send(msg, errorEmbed.setColor('RED').setDescription(locale.INVALID_ARG));

}

module.exports = {
    Name: 'linkprotection', 
    Aliases: ['lp', 'lprotection', 'lkoruma', 'linkkoruma'],
    Category: 'Moderation',
    Description: 'Protects your server from the scary links.',
    Cooldown: 1,
    Usage: 'on/off',
    RequiredPerms: ["ADMINISTRATOR"],
    RequiredBotPerms: ["MANAGE_MESSAGES", "SEND_MESSAGES", "EMBED_LINKS"],
    Run: run
}
