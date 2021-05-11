const run = async (client, message, args, locale, db) => {

    // Variables
    const { MessageEmbed } = require('discord.js');
    const path = require('path');
    
    const errorEmbed = new MessageEmbed().setColor('RED');
    const alertEmbed = new MessageEmbed().setColor('YELLOW');
    const successEmbed = new MessageEmbed().setColor('GREEN');
    const defaultEmbed = new MessageEmbed().setColor(client.branding.colors.default);

    const guildMusicState = client.guildMusicStates.get(message.guild.id);

    if (!guildMusicState || !guildMusicState.playing || !message.guild.me.voice) return message.channel.send(errorEmbed.setDescription(`${client.branding.emojis.error} ${locale.ALREADY_NOT_PLAYING}`));

    if (!message.member.voice.channel || message.guild.me.voice.channel.id != message.member.voice.channel.id) return message.channel.send(errorEmbed.setDescription(`${client.branding.emojis.error} ${locale.NOT_SAME_VC}`));

    if (guildMusicState.encoderArgs.length > 0 && !guildMusicState.encoderArgs.includes('aresample=48000,asetrate=48000*1.25')) return message.channel.send(errorEmbed.setDescription(`${client.branding.emojis.error} ${locale.ALREADY_APPLIED_FILTER}`));

    const guildData = await client.db.manager.getGuild(message.guild);
    const userData = await client.db.manager.getUser(message.author);

    let language;
    if (userData.preferences.language) language = userData.preferences.language;
    else language = guildData.data.preferences.language

    if (!language) client.config.defaults.LANGUAGE;

    const playCommand = client.commands.get('play');

    if (guildMusicState.encoderArgs.includes('aresample=48000,asetrate=48000*1.25')) {

        guildMusicState.encoderArgs = guildMusicState.encoderArgs.filter(x => x != 'aresample=48000,asetrate=48000*1.25');

        client.guildMusicStates.set(message.guild.id, guildMusicState);

        client.musicPlayer.play(client, message.guild.id, require(path.join(__dirname, '..', '..', 'Locales', language, playCommand.Category, playCommand.Name + '.json')));

        return message.channel.send(defaultEmbed.setDescription(`${locale.DISABLED}`));
    }
    else {

        guildMusicState.encoderArgs.push('aresample=48000,asetrate=48000*1.25');

        client.guildMusicStates.set(message.guild.id, guildMusicState);

        client.musicPlayer.play(client, message.guild.id, require(path.join(__dirname, '..', '..', 'Locales', language, playCommand.Category, playCommand.Name + '.json')));

        return message.channel.send(defaultEmbed.setDescription(`${locale.ENABLED}`));
    }
}

module.exports = {
    Name: 'nightcore', 
    Aliases: [],
    Category: 'Music',
    Description: 'Want to make some night core remixes ?',
    Cooldown: 4,
    Usage: '',
    RequiredPerms: [],
    RequiredBotPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    Run: run
}
