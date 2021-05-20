const run = async (client, message, args, locale, db) => {

    // Variables
    const { MessageEmbed, MessageAttachment } = require('discord.js');
    
    const errorEmbed = new MessageEmbed().setColor('RED');
    const alertEmbed = new MessageEmbed().setColor('YELLOW');
    const successEmbed = new MessageEmbed().setColor('GREEN');
    const defaultEmbed = new MessageEmbed().setColor(client.branding.colors.default);

    const canvacord = require('canvacord')

    const str = args.slice(1).join(' ');
    const mention = message.mentions.users.first() || message.author;

    if (!str) return message.channel.send(errorEmbed.setDescription(`${client.branding.emojis.error} ${locale.INVALID_COMMENT}`));

    let mode;
    if (Math.floor(Math.random(0, 1) * 10)) mode = false;
    else mode = true

    let triggered = await canvacord.Canvas.youtube({ username: mention.username, content: str, avatar: mention.displayAvatarURL({ format: "png", dynamic: false }), dark: mode });
    let attachment = new MessageAttachment(triggered, "wanted.png");

    return message.channel.send(attachment);

}

module.exports = {
    Name: 'comment', 
    Aliases: ['yorum'],
    Category: 'Fun',
    Description: 'Make someone post a comment on YouTube.',
    Cooldown: 2,
    Usage: '',
    RequiredPerms: [],
    RequiredBotPerms: ["ATTACH_FILES", "SEND_MESSAGES"],
    Run: run
}
