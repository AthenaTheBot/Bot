const BaseCommand = require('../../Structures/Command');
const {
    createAudioPlayer,
    createAudioResource,
    joinVoiceChannel,
    VoiceConnectionStatus,
    AudioPlayerStatus,
    StreamType,
    getVoiceConnection

} = require('@discordjs/voice');
const { MessageEmbed } = require('discord.js');
const playDL = require('play-dl');
const spotify = require('spotify-url-info');
const Track = require('../../Structures/Track');

class Command extends BaseCommand {
    constructor(){
        super({
            name: 'play',
            aliases: ["p"],
            description: 'Command for playing song from youtube.',
            category: 'Music',
            usage: '[song]',
            options: [{
                type: 'STRING',
                name: 'song',
                description: 'Song name or link (youtube).',
                required: true
            }],
            cooldown: 4,
            required_perms: [],
            required_bot_perms: ["SEND_MESSAGES", "READ_MESSAGE_HISTORY", "CONNECT", "SPEAK"]
        });
    }

    async run(client, msg, args, locale) {

        let guildState = client.songStates.get(msg.guild.id);
        const requestedSong = args.join(' ');
        const Embed = new MessageEmbed().setColor('#5865F2');
        const defaultGuild = {
            playing: false,
            queue: [],
            encoderArgs: [],
            guild: msg.guild,
            voiceChannel: msg.member.voice.channel,
            player: null
        }

        if (!requestedSong) return msg.reply({ embeds: [ Embed.setDescription(locale.INVALID_SONG) ] });

        if (!guildState) {
            client.songStates.set(msg.guild.id, defaultGuild)
            guildState = defaultGuild;
        }

        if (guildState.playing) {
            const queueSong = await this.getSong(requestedSong);
            if (!queueSong) return msg.reply({ embeds: [ Embed.setDescription(locale.SONG_NOT_FOUND) ] });
            guildState.queue.push(queueSong);
            let song = null;
            if (queueSong.length && queueSong.length > 0) {
                queueSong.forEach(item => {
                    guildState.queue.push(item);
                })
    
                song = queueSong[0];
            }
            return msg.reply({ embeds: [ Embed.setDescription(locale.SONG_ADDED_TO_QUEUE.replace('$song', `[${queueSong.title}](${queueSong.url})`)) ] });
        };

        let song = await this.getSong(requestedSong);

        if (!song) return msg.reply({ embeds: [ Embed.setDescription(locale.SONG_NOT_FOUND) ] });
        else if (song.length && song.length > 0) {
            song.forEach(item => {
                guildState.queue.push(item);
            })

            song = song[0];
        }

        guildState.queue.push(song);
        
        this.playSong(client, guildState, async (startedPlaying, guildState) => {
            if (!startedPlaying) msg.reply({ embeds: [ Embed.setDescription(locale.ERROR) ] });
            else {

                if (guildState.queue[0].msgSent) return;

                try {

                    await msg.reply({ embeds: [ Embed.setDescription(locale.NOW_PLAYING.replace('$song', `[${guildState.queue[0].title}](${guildState.queue[0].url})`)) ] });

                }
                catch(err) {

                    return;
                }
                
                guildState.queue[0].msgSent = true;
            }
        });
    }

    // Aditional Functions
    async getSong(reqSong) {
        const type = playDL.validate(reqSong);
        if (!type) {
            const ytSearchResult = await playDL.search(reqSong, { limit: 1, type: 'video' });
            if (ytSearchResult[0]) {

                return new Track(ytSearchResult[0].url, ytSearchResult[0].title, ytSearchResult[0].channel.name, ytSearchResult[0].durationInSec);
            }
            else {

                return null;
            }
        }
        else if (type.startsWith('sp')) {
            if (type == 'sp_track') {
                const spotifyTrackData = await spotify.getData(reqSong);
                if (spotifyTrackData) {
                    const artistNames = [];
                    spotifyTrackData.artists.forEach(artist => artistNames.push(artist.name));
                    const ytSearchResult = await playDL.search(`${artistNames.join(' ')} ${spotifyTrackData.name}`, { limit: 1, type: 'video' });
                    if (ytSearchResult[0]) {

                        return new Track(ytSearchResult[0].url, ytSearchResult[0].title, ytSearchResult[0].channel.name, ytSearchResult[0].durationInSec);
                    }
                    else {

                        return null;
                    }
                }
                else {

                    return null;
                }
            }
            else {


            }
        }
        else if (type.startsWith('yt')) {
            if (type == 'yt_video') {
                const videoInfo = await playDL.video_basic_info(reqSong);
                return new Track(videoInfo.video_details.url, videoInfo.video_details.title, videoInfo.video_details.channel.name, videoInfo.video_details.url);
            }
            else {
                const playlistInfo = await playDL.playlist_info(reqSong, true);
                const videos = [];
                if (playlistInfo?.videos) {
                    playlistInfo.videos.forEach(video => {
                        videos.push(new Track(video.url, video.title, playlistInfo.channel.name, video.durationInSec));
                    })
                }

                if (videos.length > 0) return videos;
                else return null;
            }
        }
    }

    async playSong(client, guildState, startedPlaying) {
        if (guildState.playing) return;

        let encoderArgs = [];
        if (guildState.encoderArgs.length > 0) encoderArgs = ['-af', guildState.encoderArgs.join(',')];

        const player = createAudioPlayer();
        const source = await playDL.stream(guildState.queue[0].url);
        const resource = createAudioResource(source.stream, 
        { inputType: source.type });

        if (!guildState.player) guildState.player = player;

        player.play(resource);

        player.on('error', (err) => {
            console.log('ERROR:', err);
            startedPlaying(false);
            subscription.unsubscribe();
            guildState.playing = false;
            player.stop();
            const vc = getVoiceConnection(guildState.guild.id);
            vc.destroy();
        })

        const connection = await joinVoiceChannel({ 
            channelId: guildState.voiceChannel.id,
            guildId: guildState.guild.id, 
            selfDeaf: true, 
            selfMute: false, 
            adapterCreator: guildState.guild.voiceAdapterCreator 
        });

        const subscription = connection.subscribe(player);

        player.on('stateChange', (oldState, newState) => {
            if (newState.status == AudioPlayerStatus.Playing) { 
                if (startedPlaying) startedPlaying(true, guildState);
                guildState.playing = true;
            }

            if (newState.status == AudioPlayerStatus.Idle) {
                guildState.playing = false;
                guildState.queue.shift();

                if (guildState.queue.length > 0) {
                    this.playSong(client, guildState);
                    if (startedPlaying) startedPlaying(true, guildState);
                }
                else {
                    setTimeout(() => {
                        if (guildState.queue.length == 0) {
                            guildState.playing = false;
                            player.stop();
                            const vc = getVoiceConnection(guildState.guild.id);
                            vc?.destroy();
                            client.songStates.delete(msg.guild.id);
                        }
                    }, 2 * 60 * 1000)
                }
            }
        })

        connection.on('stateChange', (oldState, newState) => {
            if (newState.status == VoiceConnectionStatus.Disconnected) {
                guildState.playing = false;
                setTimeout(() => {
                    const newGuildState = client.songStates.get(guildState.guild.id);
                    if (!newGuildState.playing) client.songStates.delete(guildState.guild.id);
                }, 5 * 60 * 1000)
            }
        })

    }
}

module.exports = Command;