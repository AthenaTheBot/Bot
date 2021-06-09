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

    if (guildMusicState.encoderArgs.length > 0 && !guildMusicState.encoderArgs.includes('bass=g=25,dynaudnorm=f=400,volume=3')) return message.channel.send(errorEmbed.setDescription(`${client.branding.emojis.error} ${locale.ALREADY_APPLIED_FILTER}`));

    const guildData = await client.db.manager.getGuild(message.guild);
    const userData = await client.db.manager.getUser(message.author);

    let language;
    if (userData.preferences.language) language = userData.preferences.language;
    else language = guildData.data.preferences.language

    if (!language) client.config.defaults.LANGUAGE;

    const playCommand = client.commands.get('play');

    if (guildMusicState.encoderArgs.includes('bass=g=25,dynaudnorm=f=400,volume=3')) {

        guildMusicState.encoderArgs = guildMusicState.encoderArgs.filter(x => x != 'bass=g=25,dynaudnorm=f=400,volume=3');

        client.guildMusicStates.set(message.guild.id, guildMusicState);

        client.musicPlayer.play(client, message.guild, require(path.join(__dirname, '..', '..', 'Locales', language, playCommand.Category, playCommand.Name + '.json')));

        return message.channel.send(defaultEmbed.setDescription(`${locale.DISABLED}`));
    }
    else {

        guildMusicState.encoderArgs.push('bass=g=25,dynaudnorm=f=400,volume=3');

        client.guildMusicStates.set(message.guild.id, guildMusicState);

        client.musicPlayer.play(client, message.guild, require(path.join(__dirname, '..', '..', 'Locales', language, playCommand.Category, playCommand.Name + '.json')));

        return message.channel.send(defaultEmbed.setDescription(`${locale.ENABLED}`));
    }
}

module.exports = {
    Name: 'bassboost', 
    Aliases: [],
    Category: 'Music',
    Description: 'Drop tha bass!',
    Cooldown: 4,
    Usage: '',
    RequiredPerms: [],
    RequiredBotPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    Run: run
}
