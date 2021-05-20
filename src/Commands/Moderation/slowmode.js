const run = async (client, message, args, locale) => {

    const { MessageEmbed } = require('discord.js');
    const errorEmbed = new MessageEmbed().setColor('RED');
    const alertEmbed = new MessageEmbed().setColor('YELLOW');
    const successEmbed = new MessageEmbed().setColor('GREEN'); 

    if (!args[0]) return message.channel.send(errorEmbed.setDescription(`${client.branding.emojis.error} ${locale.SPECIFY_ARG}`));

    if (args[0] === 'off' || args[0] === 'kapat' || args[0] === 'disable' || args[0] === '0' || args[0] === '0s' || args[0] === '0m' || args[0] === '0h') {

        message.channel.setRateLimitPerUser(0).catch(err => { return message.channel.send(errorEmbed.setDescription(`${client.branding.emojis.alert} ${locale.ERROR_MSG}`)) });

        return message.channel.send(successEmbed.setDescription(`${client.branding.emojis.success} ${locale.SUCCESSFUL_OFF}`));
    }

    let val;
    let value;
    if (args[0].endsWith('s')) {val = args[0].split('s')[0]; value = `${args[0].split('s')[0]} ${locale.SECONDS}` };
    if (args[0].endsWith('m')) {val = args[0].split('m')[0] * 60; value = `${args[0].split('m')[0]} ${locale.MINUTES}` };
    if (args[0].endsWith('h')) {val = args[0].split('h')[0] * 3600; value = `${args[0].split('h')[0]} ${locale.HOURS}` };

    if (!val || val === null || val === undefined) return message.channel.send(errorEmbed.setDescription(`${client.branding.emojis.error} ${locale.SPECIFY_ARG}`));

    message.channel.setRateLimitPerUser(val).catch(err => { return message.channel.send(errorEmbed.setDescription(`${client.branding.emojis.error} ${locale.ERROR_MSG}`)) });

    locale = JSON.parse(JSON.stringify(locale).replace('$value', value));

    return message.channel.send(successEmbed.setDescription(`${client.branding.emojis.success} ${locale.SUCCESSFUL_ON}`));

}

module.exports = {
    Name: 'slowmode', 
    Aliases: ['yavaşmod', "yavasmod"],
    Category: 'Moderation',
    Description: 'Simple slowmode command..',
    Cooldown: 1,
    Usage: 'amount (10s, 2m, 1h)',
    RequiredPerms: ["MANAGE_CHANNELS"],
    RequiredBotPerms: ["MANAGE_CHANNELS", "SEND_MESSAGES", "EMBED_LINKS"],
    Run: run
}