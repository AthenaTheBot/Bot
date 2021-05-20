const run = async (client, message, args, locale, db) => {

    // Variables
    const { MessageEmbed } = require('discord.js');
    
    const errorEmbed = new MessageEmbed().setColor('RED');
    const alertEmbed = new MessageEmbed().setColor('YELLOW');
    const successEmbed = new MessageEmbed().setColor('GREEN');
    const defaultEmbed = new MessageEmbed().setColor(client.branding.colors.default);

    const figlet = require('figlet');
    const str = args.slice(0).join(' ');

    if (!str) return message.channel.send(errorEmbed.setDescription(`${client.branding.emojis.error} ${locale.INVALID_MSG}`));

    let limit = 30
    if (str.length > limit) return message.channel.send(errorEmbed.setDescription(`${client.branding.emojis.error} ${locale.TOO_LONG_TXT.replace('$limit', limit)}`));

    figlet(str, (err, data) => {

        if (err) return client.handleError({ commandName: module.exports.Name, channelID: message.channel.id, msg: locale.ERROR_MSG, error: err, print: true });

        return message.channel.send('```diff\n' + data + '\n```');
    });

}

module.exports = {
    Name: 'ascii', 
    Aliases: [],
    Category: 'Misc',
    Description: 'Converts normal text into ascii formated text.',
    Cooldown: 2,
    Usage: 'text',
    RequiredPerms: [],
    RequiredBotPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    Run: run
}
