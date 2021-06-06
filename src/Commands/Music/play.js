const run = async (client, message, args, locale, db) => {

    // Variables
    const { MessageEmbed } = require('discord.js');
    
    const errorEmbed = new MessageEmbed().setColor('RED');
    const alertEmbed = new MessageEmbed().setColor('YELLOW');
    const successEmbed = new MessageEmbed().setColor('GREEN');
    const defaultEmbed = new MessageEmbed().setColor(client.branding.colors.default);

    const ytsr = require('ytsr');
    const songRequest = args.join(' ');

    const fetch = require('node-fetch');

    let guildMusicState = client.guildMusicStates.get(message.guild.id);

    if (!guildMusicState) {

        const defaultGuildState = {
            playing: false,
            loop: false,
            queue: [],
            textChannel: null,
            voiceChannel: null,
            connection: null,
            player: null,
            encoderArgs: []
        };

        client.guildMusicStates.set(message.guild.id, defaultGuildState);
        guildMusicState = defaultGuildState;
    };

    if (!message.member.voice.channel) return message.channel.send(errorEmbed.setDescription(`${client.branding.emojis.error} ${locale.NOT_IN_VC}`));

    if (!songRequest) return message.channel.send(errorEmbed.setDescription(`${client.branding.emojis.error} ${locale.NO_SEARCH_QUERY}`));

    if (guildMusicState.playing && message.member.voice.channel.id != message.guild.me.voice.channel.id) return message.channel.send(errorEmbed.setDescription(`${client.branding.emojis.error} ${locale.NOT_SAME_VC}`));
    else if (guildMusicState.playing && message.member.voice.channel.id == message.guild.me.voice.channel.id) {

        if (songRequest.trim().match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/gi)) {

            const videoData = await fetch(`https://www.youtube.com/oembed?url=${songRequest.trim()}&format=json`)
            .then(res => res.json()).catch(err => {})

            if (!videoData) return message.channel.send(errorEmbed.setColor('RED').setDescription(`${client.branding.emojis.error} ${locale.CANNOT_FIND_SONG}`));

            guildMusicState.queue.push({
                title: videoData.title,
                description: "Cannot found description.",
                url: songRequest,
                duration: null
            });

            return message.channel.send(defaultEmbed.setDescription(locale.SONG_ADDED.replace('$song', `[${videoData.title}](${songRequest.trim()})`)));
        }
        else {

            const youtubeResult = await (await ytsr(songRequest, { pages: 1, limit: 1})).items.filter(x => x.type === 'video');

            if (!youtubeResult[0]) return message.channel.send(errorEmbed.setColor('RED').setDescription(`${client.branding.emojis.error} ${locale.CANNOT_FIND_SONG}`));
    
            guildMusicState.queue.push({
                title: youtubeResult[0].title,
                description: youtubeResult[0].description,
                url: youtubeResult[0].url,
                duration: youtubeResult[0].duration,
                thumbnail: youtubeResult[0].bestThumbnail.url,
                artist: {
                    name: youtubeResult[0].author.name,
                    url: youtubeResult[0].author.url
                }
            });
    
            return message.channel.send(defaultEmbed.setDescription(locale.SONG_ADDED.replace('$song', `[${youtubeResult[0].title}](${youtubeResult[0].url})`)));
        }

    }
    else if (!guildMusicState.playing) {

        const connection = await message.member.voice.channel.join().catch(err => {});

        if (!connection) return message.channel.send(errorEmbed.setDescription(locale.CANNOT_JOIN_VC));

        guildMusicState.connection = connection;
        guildMusicState.textChannel = message.channel.id;
        guildMusicState.voiceChannel = message.member.voice.channel.id;

        if (songRequest.trim().match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/gi)) {

            const videoData = await fetch(`https://www.youtube.com/oembed?url=${songRequest.trim()}&format=json`)
            .then(res => res.json()).catch(err => {})

            if (!videoData) return message.channel.send(errorEmbed.setColor('RED').setDescription(`${client.branding.emojis.error} ${locale.CANNOT_FIND_SONG}`));

            guildMusicState.queue.push({
                title: videoData.title,
                description: "Cannot found description.",
                url: songRequest,
                duration: null,
                thumbnail: null,
                artist: {
                    name: 'Unknown',
                    url: null
                }
            });

            if (guildMusicState.queue.length > 1) message.channel.send(defaultEmbed.setDescription(locale.SONG_ADDED.replace('$song', `[${videoData.title}](${songRequest.trim()})`)));
        }
        else {

            const youtubeResult = await (await ytsr(songRequest, { pages: 1, limit: 1})).items.filter(x => x.type === 'video');

            if (!youtubeResult[0]) return message.channel.send(errorEmbed.setColor('RED').setDescription(`${client.branding.emojis.error} ${locale.CANNOT_FIND_SONG}`));
            
            guildMusicState.queue.push({
                title: youtubeResult[0].title,
                description: youtubeResult[0].description,
                url: youtubeResult[0].url,
                duration: youtubeResult[0].duration,
                thumbnail: youtubeResult[0].bestThumbnail.url,
                artist: {
                    name: youtubeResult[0].author.name,
                    url: youtubeResult[0].author.url
                }
            });

            if (guildMusicState.queue.length > 1) message.channel.send(defaultEmbed.setDescription(locale.SONG_ADDED.replace('$song', `[${youtubeResult[0].title}](${youtubeResult[0].url})`)));
        }
        
        client.musicPlayer.play(client, message.guild.id, locale).catch(err => {
          
            client.handleError({ commandName: module.exports.Name, channelID: message.channel.id, msg: locale.ERROR_MSG, error: err, print: true });
        });
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
