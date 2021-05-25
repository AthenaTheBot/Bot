const run = async (client, message, args, locale, db) => {

    // Variables
    const { MessageEmbed } = require('discord.js');
    
    const errorEmbed = new MessageEmbed().setColor('RED');
    const alertEmbed = new MessageEmbed().setColor('YELLOW');
    const successEmbed = new MessageEmbed().setColor('GREEN');
    const defaultEmbed = new MessageEmbed().setColor(client.branding.colors.default);

    return message.channel.send(successEmbed.setDescription(`[${locale.MSG}](https://athenabot.site/report)`));
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
