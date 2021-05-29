const run = async (client, message, args, locale, db) => {

    // Variables
    const { MessageEmbed } = require('discord.js');
    
    const errorEmbed = new MessageEmbed().setColor('RED');
    const alertEmbed = new MessageEmbed().setColor('YELLOW');
    const successEmbed = new MessageEmbed().setColor('GREEN');
    const defaultEmbed = new MessageEmbed().setColor(client.branding.colors.default);

    const guildMusicState = client.guildMusicStates.get(message.guild.id);

    if (!message.guild.me.voice.channel || !guildMusicState || !guildMusicState.playing) return message.channel.send(errorEmbed.setDescription(`${client.branding.emojis.error} ${locale.ALREADY_NOT_PLAYING}`));

    if (!message.member.voice.channel) message.member.voice.channel.id = null;

    if (message.guild.me.voice.channel.id !== message.member.voice.channel.id) return message.channel.send(errorEmbed.setDescription(`${client.branding.emojis.error} ${locale.NOT_SAME_VC}`));

    if (guildMusicState.loop) {

        guildMusicState.loop = false;
        return message.channel.send(defaultEmbed.setColor(client.branding.colors.default).setDescription(locale.DISABLED_LOOP));
    }
    else {

        guildMusicState.loop = true;
        return message.channel.send(defaultEmbed.setColor(client.branding.colors.default).setDescription(locale.ENABLED_LOOP));
    }
}

module.exports = {
    Name: 'loop', 
    Aliases: ['döngü'],
    Category: 'Music',
    Description: 'Loop the current song queue.',
    Cooldown: 4,
    Usage: '',
    RequiredPerms: [],
    RequiredBotPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    Run: run
}
