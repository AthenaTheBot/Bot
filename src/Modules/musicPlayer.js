const ytdl = require('discord-ytdl-core');
const { MessageEmbed } = require('discord.js');
const path = require('path');

const Embed = new MessageEmbed();

module.exports.play = async (base, guild) => {

    if (!base || !guild ) return;

    const guildData = await base.db.manager.getGuild(guild);

    let language;
    if (guildData.data.preferences.language) language = guildData.data.preferences.language;
    else language = 'en-US';

    const locale = require(path.join(__dirname, '..', 'Locales', language, 'Music', 'play.json'));

    let guildMusicState = base.guildMusicStates.get(guild.id);

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

            const textChannel = base.channels.cache.get(guildMusicState.textChannel);

            player.on('start', async () => {
                textChannel.send(Embed.setColor(base.branding.colors.default).setDescription(locale.NOW_PLAYING.replace('$song', `[${guildMusicState.queue[0].title}](${guildMusicState.queue[0].url})`)));
                guildMusicState.playing = true;
            });
    
            player.on('finish', async () => {
                if (!guildMusicState.loop) {
                    guildMusicState.queue.shift();
                    guildMusicState.playing = false;
                    if (guildMusicState.queue.length == 0) {
                        textChannel.send(Embed.setColor(base.branding.colors.default).setDescription(locale.QUEUE_FINISHED));
                        setTimeout(async () => {
                            const newGuildMusicState = await base.guildMusicStates.get(guild.id);
                            if (newGuildMusicState && newGuildMusicState.playing) return;
                            else {
                                if (!newGuildMusicState || !newGuildMusicState.connection) return;
                                base.channels.cache.get(newGuildMusicState.voiceChannel).leave();
                                textChannel.send(Embed.setColor(base.branding.colors.default).setDescription(locale.INACTIVE_FOR_TOO_LONG));
                                base.guildMusicStates.delete(guild.id);
                            }
                        }, 150 * 1000);
                    }
                    else {
        
                        this.play(base, guild, locale);
                    }
                }
                else {
                    guildMusicState.queue.push(guildMusicState.queue[0]);
                    guildMusicState.queue.shift();
                    if (guildMusicState.queue.length == 0) {
                        textChannel.send(Embed.setColor(base.branding.colors.default).setDescription(locale.QUEUE_FINISHED));
                        setTimeout(async () => {
                            const newGuildMusicState = await base.guildMusicStates.get(guild.id);
                            if (newGuildMusicState && newGuildMusicState.playing) return;
                            else {
                                if (!newGuildMusicState || !newGuildMusicState.connection) return;
                                base.channels.cache.get(newGuildMusicState.voiceChannel).leave();
                                textChannel.send(Embed.setColor(base.branding.colors.default).setDescription(locale.INACTIVE_FOR_TOO_LONG));
                                base.guildMusicStates.delete(guild.id);
                            }
                        }, 150 * 1000);
                    }
                    else {

                        this.play(base, guild, locale);
                    }
                }
            });
    
            guildMusicState.connection.on('disconnect', async () => {
                guildMusicState.playing = false;
                setTimeout(async () => {
                    const updatedGuildMusicState = await base.guildMusicStates.get(guild.id);
                    if (updatedGuildMusicState && updatedGuildMusicState.playing) return;
                    else {
                        return base.guildMusicStates.delete(guild.id);
                    }
                }, 30 * 60 * 1000);
            });
        }
        else {

            base.handleError({ commandName: 'None (musicPlayer)', channelID: guildMusicState.textChannel, msg: locale.ERROR_MSG, error: err, print: true });
        }

    }
    else {

        return;
    }
};