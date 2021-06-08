const run = async (client, message, args, locale, db) => {

    // Variables
    const { MessageEmbed } = require('discord.js');
    const path = require('path');
    
    const errorEmbed = new MessageEmbed().setColor('RED');
    const alertEmbed = new MessageEmbed().setColor('YELLOW');
    const successEmbed = new MessageEmbed().setColor('GREEN');
    const defaultEmbed = new MessageEmbed().setColor(client.branding.colors.default);

    const guildMusicState = await client.guildMusicStates.get(message.guild.id);

    if (!guildMusicState || !guildMusicState.playing || guildMusicState.queue.length === 0) return message.channel.send(errorEmbed.setDescription(`${client.branding.emojis.error} ${locale.ALREADY_NOT_PLAYING}`));

    if (!message.member.voice.channel) message.member.voice.channel.id = null;

    if (message.guild.me.voice.channel.id !== message.member.voice.channel.id) return message.channel.send(errorEmbed.setDescription(`${client.branding.emojis.error} ${locale.NOT_SAME_VC}`));

    if (guildMusicState.loop) {
        guildMusicState.queue.push(guildMusicState.queue[0]);
    }

    guildMusicState.queue.shift();

    if (!guildMusicState.queue || guildMusicState.queue.length === 0) {
        if (!guildMusicState.playing) return message.channel.send(errorEmbed.setDescription(`${client.branding.emojis.error} ${locale.NO_MUSIC_TO_SKIP}`));
        
        client.guildMusicStates.delete(message.guild.id);

        message.guild.me.voice.channel.leave();
        
        return message.channel.send(defaultEmbed.setDescription(locale.QUEUE_ENDED))
    }

    const guildData = await client.db.manager.getGuild(message.guild);
    const userData = await client.db.manager.getUser(message.author);

    let language;
    if (userData.preferences.language) language = userData.preferences.language;
    else language = guildData.data.preferences.language;

    if (!language) client.config.defaults.LANGUAGE;

    client.musicPlayer.play(client, message.guild);

    return message.channel.send(locale.SKIPPED_SONG);
}

module.exports = {
    Name: 'skip', 
    Aliases: ['geç', 's'],
    Category: 'Music',
    Description: '',
    Cooldown: 4,
    Usage: '',
    RequiredPerms: [],
    RequiredBotPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    Run: run
}
