const run = async (client, message, args, locale, db) => {

    // Variables
    const { MessageEmbed } = require('discord.js');
    
    const errorEmbed = new MessageEmbed().setColor('RED');
    const alertEmbed = new MessageEmbed().setColor('YELLOW');
    const successEmbed = new MessageEmbed().setColor('GREEN');
    const defaultEmbed = new MessageEmbed().setColor(client.branding.colors.default);

    const int = Math.floor(Math.random() * 2);

    defaultEmbed
    .setColor('RANDOM')
    .setTitle(locale.TITLE)
    .setImage('https://media.giphy.com/media/FfrlRYkqKY1lC/giphy.gif')
    const flippingMessage = await message.channel.send(defaultEmbed);
    
    if (int === 1) {
        setTimeout(() => {  
            flippingMessage.delete().catch(err => {});
            message.channel.send(locale.RESULT1);
        }, 2500);
        return;
    } else return setTimeout(() => {  message.channel.send(locale.RESULT2) }, 2500);

}

module.exports = {
    Name: 'coinflip', 
    Aliases: ['yazıtura', 'yazitura'],
    Category: 'Fun',
    Description: 'Simple coinflip command.',
    Cooldown: 1.5,
    Usage: '',
    RequiredPerms: [],
    RequiredBotPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    Run: run
}
