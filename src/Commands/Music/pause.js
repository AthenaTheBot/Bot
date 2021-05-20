const run = async (client, message, args, locale, db) => {

    // Variables
    const { MessageEmbed } = require('discord.js');
    
    const errorEmbed = new MessageEmbed().setColor('RED');
    const alertEmbed = new MessageEmbed().setColor('YELLOW');
    const successEmbed = new MessageEmbed().setColor('GREEN');
    const defaultEmbed = new MessageEmbed().setColor(client.branding.colors.default);

    const guildMusicState = await client.guildMusicStates.get(message.guild.id);

    if (!guildMusicState || !guildMusicState.playing || guildMusicState.queue.length === 0) return message.channel.send(errorEmbed.setDescription(`${client.branding.emojis.error} ${locale.ALREADY_NOT_PLAYING}`));

    if (!message.member.voice.channel) message.member.voice.channel.id = null;

    if (message.guild.me.voice.channel.id !== message.member.voice.channel.id) return message.channel.send(errorEmbed.setDescription(`${client.branding.emojis.error} ${locale.NOT_SAME_VC}`));

    guildMusicState.player.pause();

    return message.channel.send(defaultEmbed.setDescription(locale.PAUSED));
}

module.exports = {
    Name: 'pause', 
    Aliases: ['dur'],
    Category: 'Music',
    Description: '',
    Cooldown: 2,
    Usage: '',
    RequiredPerms: [],
    RequiredBotPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    Run: run
}
