const run = async (client, message, args, locale, db) => {

    // Variables
    const { MessageEmbed, Base } = require('discord.js');
    
    const errorEmbed = new MessageEmbed().setColor('RED');
    const alertEmbed = new MessageEmbed().setColor('YELLOW');
    const successEmbed = new MessageEmbed().setColor('GREEN');
    const defaultEmbed = new MessageEmbed().setColor(client.branding.colors.default);

    const ytdl = require('discord-ytdl-core');
    const ytsr = require('ytsr');

    const search_parm = args.slice(0).join(' ');

    if (!message.member.voice.channel) return message.channel.send(errorEmbed.setDescription(`${client.branding.emojis.error} ${locale.NOT_IN_VC}`));

    if (!search_parm) return message.channel.send(errorEmbed.setDescription(`${client.branding.emojis.error}  ${locale.SPECIFY_SONG}`));

    let result = await (await ytsr(search_parm, { pages: 1, limit: 1})).items.filter(x => x.type === 'video');

    if (!result[0] || result[0] === undefined || result[0] === null) return message.channel.send(errorEmbed.setDescription(locale.SONG_NOT_FOUND))

    if (!client.guildQueues.get(message.guild.id)) { 
        client.guildQueues.set(message.guild.id, {
            playing: null,
            queue: [{ title: result[0].title, description: result[0].description, url: result[0].url, duration: result[0].duration }]
        });

    }
    else {

        const currentObject = client.guildQueues.get(message.guild.id);

        const currentQueue = new Array();

        currentObject.queue.forEach(song => { currentQueue.push(song) });

        currentQueue.push({ title: result[0].title, description: result[0].description, url: result[0].url, duration: result[0].duration  });

        client.guildQueues.set(message.guild.id, { 
            playing: currentObject.playing,
            queue: currentQueue
        })
    }

    const playSong = async () => {

        const data = await client.guildQueues.get(message.guild.id);

        const currentQueue = data.queue;

        if (!currentQueue || currentQueue === undefined || currentQueue === null) return client.handleError({ type: 2, commandName: module.exports.Name, channelID: message.channel.id, msg: locale.ERROR_MSG, error: err });

        if (data.playing === true) return message.channel.send(defaultEmbed.setDescription(`${locale.ADDED_TO_THE_QUEUE} [${result[0].title}](${result[0].url})`));

        let connection = null;

        try {

            connection = await message.member.voice.channel.join();
        }
        catch(err) {

            if (err.code == 'VOICE_JOIN_CHANNEL') return message.channel.send(errorEmbed.setDescription(`${client.branding.emojis.error} ${locale.PERM_ERROR}`));
            else {

                client.log('error', err);
                client.handleError({ type: 1, commandName: module.exports.Name, channelID: message.channel.id, msg: locale.ERROR_MSG, error: err, print: true });
            }
        }

        const dispatcher = connection.play(await ytdl(currentQueue[0].url), { type: 'opus' });

        dispatcher.on('start', async () => {

            client.guildQueues.set(message.guild.id, { playing: true, queue: data.queue });
            message.channel.send(defaultEmbed.setDescription(`${locale.NOW_PLAYING} [${currentQueue[0].title}](${currentQueue[0].url})`));
        });
        
        dispatcher.on('finish', async () => {

            const newQueue = new Array();

            await data.queue.forEach(song => { newQueue.push(song) });

            newQueue.shift();

            client.guildQueues.set(message.guild.id, { 
                playing: false,
                queue: newQueue
            })

            if (newQueue.length > 0) {
                return playSong();
            }
            else {
                message.channel.send(defaultEmbed.setDescription(locale.QUEUE_ENDED));
                setTimeout(async() => {
                    const data3 = await client.guildQueues.get(message.guild.id);
                    if (data3.queue.length > 0) return;
                    else {
                        if (!message.guild.me.voice.channel) return;
                        message.guild.me.voice.channel.leave();
                        return message.channel.send(defaultEmbed.setDescription(locale.INACTIVE_FOR_TOO_LONG))
                    }
                },  150 * 1000)
            }
        });

        connection.on('disconnect', async() => {
            const guildMusicState = client.guildQueues.get(message.guild.id);
            if (!guildMusicState) return;
            client.guildQueues.set(message.guild.id, {
                playing: false,
                queue: guildMusicState.queue
            })
    
            setTimeout(async () => {
    
                const check = await client.guildQueues.get(message.guild.id);
    
                if (check.playing) return;
                else {
    
                    client.guildQueues.set(message.guild.id, { playing: false, queue: [] })
                }
    
            }, 18000000);
        })

        dispatcher.on('error', console.error);

        // Exports
        module.exports.playSong = playSong;
        module.exports.pauseSong = () => { dispatcher.pause(); };
        module.exports.resumeSong = () => { dispatcher.resume(); };
        module.exports.setVolume = (volume) => { dispatcher.setVolume(volume) };
    
    }

    playSong();

}

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
