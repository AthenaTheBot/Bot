const run = async (client, message, args, locale, db) => {

    // Variables
    const { MessageEmbed } = require('discord.js');
    
    const errorEmbed = new MessageEmbed().setColor('RED');
    const alertEmbed = new MessageEmbed().setColor('YELLOW');
    const successEmbed = new MessageEmbed().setColor('GREEN');
    const defaultEmbed = new MessageEmbed().setColor(client.branding.colors.default);

    const ytsr = require('ytsr');
    const songRequest = args.join(' ');

    let guildMusicState = client.guildMusicStates.get(message.guild.id);

    if (!guildMusicState) {

        const defaultGuildState = {
            playing: false,
            queue: [],
            voiceChannel: null,
            textChannel: null,
            connection: null,
            player: null
        };

        client.guildMusicStates.set(message.guild.id, defaultGuildState);
        guildMusicState = defaultGuildState;
    };

    if (guildMusicState.playing && message.member.voice.channel.id != guildMusicState.voiceChannel) return message.channel.send(errorEmbed.setDescription(locale.NOT_SAME_VC));
    else if (guildMusicState.playing && message.member.voice.channel.id == guildMusicState.voiceChannel) {

        const youtubeResult = await (await ytsr(songRequest, { pages: 1, limit: 1})).items.filter(x => x.type === 'video');

        guildMusicState.queue.push({
            title: youtubeResult[0].title,
            description: youtubeResult[0].description,
            url: youtubeResult[0].url,
            duration: youtubeResult[0].duration    
        });

        client.guildMusicStates.set(message.guild.id, guildMusicState);

        return message.channel.send(defaultEmbed.setDescription(locale.SONG_ADDED.replace('$song', `[${youtubeResult[0].title}](${youtubeResult[0].url})`)));
    }
    else if (!guildMusicState.playing) {

        const connection = await message.member.voice.channel.join().catch(err => {});

        if (!connection) return message.channel.send(errorEmbed.setDescription(locale.CANNOT_JOIN_VC));

        guildMusicState.connection = connection;
        guildMusicState.voiceChannel = message.member.voice.channel.id;
        guildMusicState.textChannel = message.channel.id;

        const youtubeResult = await (await ytsr(songRequest, { pages: 1, limit: 1})).items.filter(x => x.type === 'video');

        guildMusicState.queue.push({
            title: youtubeResult[0].title,
            description: youtubeResult[0].description,
            url: youtubeResult[0].url,
            duration: youtubeResult[0].duration    
        });

        client.guildMusicStates.set(message.guild.id, guildMusicState);

        client.musicPlayer.play(client, message.guild.id, locale).catch(err => {});
    };

};

module.exports = {
    Name: 'play', 
    Aliases: ['çal', 'p'],
    Category: 'Music',
    Description: 'Simple music play command.',
    Cooldown: 4,
    Usage: 'song name',
    RequiredPerms: [],
    RequiredBotPerms: ["SEND_MESSAGES", "EMBED_LINKS", "CONNECT", "SPEAK"],
    Run: run
}
