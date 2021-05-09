const run = async (client, message, args, locale, db) => {

    // Variables
    const { MessageEmbed, MessageAttachment } = require('discord.js');
    
    const errorEmbed = new MessageEmbed().setColor('RED');
    const alertEmbed = new MessageEmbed().setColor('YELLOW');
    const successEmbed = new MessageEmbed().setColor('GREEN');
    const defaultEmbed = new MessageEmbed().setColor(client.branding.colors.default);

    const canvacord = require('canvacord')

    const loadingMessage = await message.channel.send(`${client.branding.emojis.loading} ${locale.LOADING}`);

    let user = message.mentions.users.first() || message.author;
    let triggered = await canvacord.Canvas.jail(user.displayAvatarURL({ format: "png", dynamic: false }), false);
    let attachment = new MessageAttachment(triggered, "jail.png");

    await loadingMessage.delete().catch(err => {});

    return message.channel.send(attachment);

}

module.exports = {
    Name: 'jail', 
    Aliases: ['hapis'],
    Category: 'Fun',
    Description: 'Are you in jail ?',
    Cooldown: 2,
    Usage: '',
    RequiredPerms: [],
    RequiredBotPerms: ["ATTACH_FILES", "SEND_MESSAGES"],
    Run: run
}
