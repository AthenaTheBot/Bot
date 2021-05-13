const ytdl = require('discord-ytdl-core');
const { MessageEmbed } = require('discord.js');

const Embed = new MessageEmbed();

module.exports.play = async (base, guild, locale) => {

    if (!base || !guild || !locale) return;

    let guildMusicState = base.guildMusicStates.get(guild);

    if (guildMusicState && guildMusicState.connection) {

        let encoderArgs;
        if (guildMusicState.encoderArgs.length > 0) encoderArgs = ['-af', ...guildMusicState.encoderArgs];

        let player;
        try {

            player = await guildMusicState.connection.play(await ytdl(guildMusicState.queue[0].url, {
                filter: "audioonly",
                opusEncoded: true,
                encoderArgs: encoderArgs
            }), 
            { type: 'opus' });

        }
        catch (err) {

            base.handleError({ commandName: 'None (musicPlayer)', channelID: guildMusicState.textChannel, msg: locale.ERROR_MSG, error: err, print: true });
        }

        if (player) {

            guildMusicState.player = player;
        }

        const textChannel = base.channels.cache.get(guildMusicState.textChannel);

        player.on('start', async () => {
            textChannel.send(Embed.setColor(base.branding.colors.default).setDescription(locale.NOW_PLAYING.replace('$song', `[${guildMusicState.queue[0].title}](${guildMusicState.queue[0].url})`)));
            guildMusicState.playing = true;
        });

        player.on('finish', async () => {
            textChannel.send(locale.SONG_FINISHED);
            guildMusicState.queue.shift();
            guildMusicState.playing = false;
            if (guildMusicState.queue.length == 0) {
                textChannel.send(Embed.setColor(base.branding.colors.default).setDescription(locale.QUEUE_FINISHED));
                setTimeout(async () => {
                    const newGuildMusicState = await base.guildMusicStates.get(guild);
                    if (newGuildMusicState && newGuildMusicState.playing) return;
                    else {
                        if (!newGuildMusicState) return;
                        message.guild.me.voice.channel.leave();
                        textChannel.send(Embed.setColor(base.branding.colors.default).setDescription(locale.INACTIVE_FOR_TOO_LONG));
                        base.guildMusicStates.delete(guild);
                    }
                }, 150 * 1000);
            }
            else {

                this.play(base, guild, locale);
            }
        });

        guildMusicState.connection.on('disconnect', async () => {
            guildMusicState.playing = false;
            setTimeout(async () => {
                const updatedGuildMusicState = await base.guildMusicStates.get(guild);
                if (updatedGuildMusicState.playing) return;
                else {
                    return base.guildMusicStates.delete(guild);
                }
            }, 30 * 60 * 1000);
        });

    }
    else {

        return;
    }
};