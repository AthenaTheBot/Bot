const run = async (client, message, args, locale, db) => {

    // Variables
    const { MessageEmbed } = require('discord.js');
    
    const errorEmbed = new MessageEmbed().setColor('RED');
    const alertEmbed = new MessageEmbed().setColor('YELLOW');
    const successEmbed = new MessageEmbed().setColor('GREEN');
    const defaultEmbed = new MessageEmbed().setColor(client.branding.colors.default);

    defaultEmbed
    .setDescription(locale.MSG);

    return message.channel.send(defaultEmbed).catch(err => {});
}

module.exports = {
    Name: 'invite', 
    Aliases: ['davet'],
    Category: 'Misc',
    Description: 'Simple command that sends the invite link of Athena.',
    Cooldown: 4,
    Usage: '',
    RequiredPerms: [],
    RequiredBotPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    Run: run
}