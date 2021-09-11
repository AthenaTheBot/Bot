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
const ytdl = require('discord-ytdl-core');
const ytpl = require('ytpl');
const ytsr = require('ytsr');
const { getInfo } = require('ytdl-core');
const { MessageEmbed } = require('discord.js');
const Spotify = require('spotify-url-info');

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

        if (!requestedSong) return msg.reply(locale.INVALID_SONG);

        if (!guildState) {
            client.songStates.set(msg.guild.id, defaultGuild)
            guildState = defaultGuild;
        }

        if (guildState.playing) {
            const queueSong = await this.getSong(requestedSong);
            if (!queueSong) return msg.reply({ embeds: [ Embed.setDescription(locale.SONG_NOT_FOUND) ] });
            guildState.queue.push(queueSong);
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
        
        this.playSong(guildState, (startedPlaying) => {
            if (!startedPlaying) msg.reply(locale.ERROR);
            else {

                msg.reply({ embeds: [ Embed.setDescription(locale.NOW_PLAYING.replace('$song', `[${guildState.queue[0].title}](${guildState.queue[0].url})`)) ] });
            }
        });
    }

    // Aditional Functions
    async getSong(reqSong) {
        let song = {};
        let songInfo = {};

        const youtubeVidRegExp = new RegExp(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/gi)
        const youtubePlaylistRegExp = new RegExp(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/gi)

        if (reqSong.trim().match(youtubeVidRegExp)) {
            songInfo = await getInfo(reqSong.trim()).catch(err => {});
            if (songInfo) {

                song.url = reqSong,
                song.title = songInfo.videoDetails.title,
                song.description = songInfo.videoDetails.description,
                song.duration = songInfo.videoDetails.lengthSeconds
                song.author = {
                    name: songInfo.videoDetails.author.name
                }
            }
            else {

                song = null;
            }
        }
        else if (reqSong.trim().match(youtubePlaylistRegExp)) {
            let songs = [];
            const playlist = await ytpl(reqSong);

            if (playlist?.items) {
                playlist.items.forEach(item => {
                    let songDur = item.duration.split(':');
                    songDur = parseInt((songDur[0] * 60)) + parseInt(songDur[1]);

                    songs.push({
                        url : item.url,
                        title : item.title,
                        description : item.description,
                        duration : songDur,
                        author : {
                            name: item.author.name
                        }
                    })
                })
            }

            if (songs.length > 0) song = songs;
        }
        else if (reqSong.trim().startsWith('https://open.spotify.com/track/')) {
            songInfo = await Spotify.getPreview(reqSong.trim());
            if  (songInfo) {
                return this.getSong(`${songInfo.title} ${songInfo.artist}`);            
            }
        }
        else {
            
            songInfo = (await ytsr(reqSong, { limit: 2 }).catch(err => {}))?.items?.find(x => x.type == 'video');
            if (songInfo) {

                let songDur = songInfo.duration.split(':');
                songDur = parseInt((songDur[0] * 60)) + parseInt(songDur[1]);

                song.url = songInfo.url;
                song.title = songInfo.title;
                song.description = songInfo.description;
                song.duration = songDur;
                song.author = {
                    name: songInfo.author.name
                };
            }
            else {

                song = null;
            }
        }

        if (song) return song;
        else return null;
    }

    async playSong(guildState, startedPlaying) {
        if (guildState.playing) return;

        let encoderArgs = [];
        if (guildState.encoderArgs.length > 0) encoderArgs = ['-af', guildState.encoderArgs.join(',')];

        const player = createAudioPlayer();
        const resource = createAudioResource(await ytdl(guildState.queue[0].url, { 
            filter: 'audioonly', 
            opusEncoded: true,
            encoderArgs: encoderArgs
        }), 
        { inputType: StreamType.Opus });

        if (!guildState.player) guildState.player = player;

        player.play(resource);

        player.on('error', () => {
            subscription.unsubscribe();
        })

        const connection = await joinVoiceChannel({ 
            channelId: guildState.voiceChannel.id, // ! ERROR: TypeError: Cannot read property 'id' of null
            guildId: guildState.guild.id, 
            selfDeaf: true, 
            selfMute: false, 
            adapterCreator: guildState.guild.voiceAdapterCreator 
        });

        const subscription = connection.subscribe(player);

        player.on('stateChange', (oldState, newState) => {
            if (newState.status == AudioPlayerStatus.Playing) { 
                if (startedPlaying) startedPlaying(true);
                guildState.playing = true;
            }

            if (newState.status == AudioPlayerStatus.Idle) {
                guildState.playing = false;
                guildState.queue.shift();

                if (guildState.queue.length > 0) {
                    this.playSong(guildState);
                    if (startedPlaying) startedPlaying(true);
                }
                else {
                    setTimeout(() => {
                        if (guildState.queue.length == 0) {
                            guildState.playing = false;
                            player.stop();
                            const vc = getVoiceConnection(guildState.guild.id);
                            vc.destroy();
                        }
                    }, 2 * 60 * 1000)
                }
            }
        })

        connection.on('stateChange', (oldState, newState) => {
            if (newState.status == VoiceConnectionStatus.Disconnected) {
                guildState.playing = false;
            }
        })

    }
}

module.exports = Command;