module.exports.play = async(base, channel) => {

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
}

// Exports
module.exports.pauseSong = () => { dispatcher.pause(); };
module.exports.resumeSong = () => { dispatcher.resume(); };
module.exports.setVolume = (volume) => { dispatcher.setVolume(volume) };