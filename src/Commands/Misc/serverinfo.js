const run = async (client, message, args, locale, db) => {

    // Variables
    const { MessageEmbed } = require('discord.js');
    
    const errorEmbed = new MessageEmbed().setColor('RED');
    const alertEmbed = new MessageEmbed().setColor('YELLOW');
    const successEmbed = new MessageEmbed().setColor('GREEN');
    const defaultEmbed = new MessageEmbed().setColor(client.branding.colors.default);

    const moment = require('moment');

    const verificationLevels = {
        "NONE": locale.NONE,
        "LOW": locale.LOW,
        "MEDIUM": locale.MEDIUM,
        "HIGH": locale.HIGH,
        "VERY_HIGH": locale.VERY_HIGH
    }

    const boostLevls = {
        "0": locale.NONE,
        "1": locale.LEVEL_1,
        "2": locale.LEVEL_2,
        "3": locale.LEVEL_3
    }

    const roles = new Array();
    if (message.guild.roles.cache.size > 0) {
        message.guild.roles.cache.forEach(x => {
            if (roles.length >= 15) {
                if (roles.length >= 16) return;
                let remainingRoles = message.guild.roles.cache.size - (roles.length);
                return roles.push(locale.REMAINS_MORE.replace('$count', remainingRoles));
            }
    
            roles.push(`<@&${x.id}>`);
        });
    } else {
        roles.push(locale.NONE);
    }

    let afkChannel = message.guild.afkChannel
    if (afkChannel === undefined || afkChannel === null) afkChannel = locale.NONE;

    defaultEmbed
    .setThumbnail(message.guild.iconURL())
    .setFooter(locale.FOOTER, message.author.displayAvatarURL())
    .setDescription(`**${message.guild.name}** | ${locale.DESC} \n ────────────────────`)
    .addFields(
        { name: 'ID', value: `\`${message.guild.id}\``, inline: true },
        { name: locale.CREATED_AT, value: moment(message.guild.createdTimestamp).format('DD/MM/YYYY'), inline: true },
        { name: locale.REGION, value: message.guild.region.charAt(0).toUpperCase() + message.guild.region.slice(1), inline: true },
        { name: locale.MEMBER_COUNT, value: `\`${message.guild.memberCount}\``, inline: true },
        { name: locale.VERIFICATION_LEVEL, value: verificationLevels[message.guild.verificationLevel], inline: true },
        { name: locale.BOOST, value: boostLevls[message.guild.premiumTier], inline: true},
        { name: locale.OWNER, value: `<@${message.guild.ownerID}>`, inline: true },
        { name: locale.CHANNEL_COUNT, value: `${locale.TXT_CHANNELS}: \`${message.guild.channels.cache.filter(x => x.type === 'text').size}\` \n ${locale.VC_CHANNELS}: \`${message.guild.channels.cache.filter(x => x.type = 'voice').size}\` `, inline: true },
        { name: locale.AFK_CHANNEL, value: afkChannel, inline: true },
        { name: locale.ROLES + ` (${message.guild.roles.cache.size})`, value: roles.join(', '), inline: false },
    )
    return message.channel.send(defaultEmbed);

}

module.exports = {
    Name: 'serverinfo', 
    Aliases: ['SERVERİNFO', 'sunucubilgi'],
    Category: 'Misc',
    Description: 'Get informatin about the current server.',
    Cooldown: 2,
    Usage: '',
    RequiredPerms: [],
    RequiredBotPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    Run: run
}
