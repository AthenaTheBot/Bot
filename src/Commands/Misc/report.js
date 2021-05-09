const run = async (client, message, args, locale, db) => {

    // Variables
    const { MessageEmbed } = require('discord.js');
    
    const errorEmbed = new MessageEmbed().setColor('RED');
    const alertEmbed = new MessageEmbed().setColor('YELLOW');
    const successEmbed = new MessageEmbed().setColor('GREEN');
    const defaultEmbed = new MessageEmbed().setColor(client.branding.colors.default);

    const str = args.slice(0).join(' ');

    if (!str) return message.channel.send(errorEmbed.setDescription(`${client.branding.emojis.error} ${locale.INVALID_REPORT}`));

    client.channels.cache.get(client.config.channels.REPORT).send(defaultEmbed.setDescription(`**Report Content**: \n ${str} \n \n **Reporter**: \n ${message.author.username}#${message.author.tag} | \`${message.author.id}\` `));

    return message.channel.send(successEmbed.setDescription(`${client.branding.emojis.success} ${locale.SUCCESS}`));
}

module.exports = {
    Name: 'report', 
    Aliases: ['raportet', 'raporla', 'rapor'],
    Category: 'Misc',
    Description: 'If you are having any troubles with Athena you can report the problem with this command.',
    Cooldown: 10,
    Usage: '[your problem]',
    RequiredPerms: [],
    RequiredBotPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    Run: run
}
