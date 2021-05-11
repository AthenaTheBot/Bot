const run = async (client, message, args, locale, db) => {

    // Variables
    const { MessageEmbed } = require('discord.js');
    
    const errorEmbed = new MessageEmbed().setColor('RED');
    const alertEmbed = new MessageEmbed().setColor('YELLOW');
    const successEmbed = new MessageEmbed().setColor('GREEN');
    const defaultEmbed = new MessageEmbed().setColor(client.branding.colors.default);

    const fetch = require('node-fetch');
    let song = args.slice(0).join(' ');

    const guildMusicState = await client.guildMusicStates.get(message.guild.id);

    if (!song) {

        if (!guildMusicState || guildMusicState.playing == false || guildMusicState.queue.length == 0) return message.channel.send(errorEmbed.setColor('RED').setDescription(`${client.branding.emojis.error} ${locale.SPECIFY_SONG}`));

        song = guildMusicState.queue[0].title;

    }

    song = song.toLowerCase().replace('ı', 'i').replace('İ', 'i').replace(/[^a-z0-9]+/g, " ").replace(/^-+|-+$/g, " ").replace(/^-+|-+$/g, '').replace('official video', '').replace('official', '').replace('video', '').replace('music', '').replace('audio', '');

    const search = await fetch(`http://api.musixmatch.com/ws/1.1/track.search?q=${song}&page_size=1&page=1&s_track_rating=desc&apikey=${client.config.apiKeys.MUSIXMATCH}`).then(res => res.json());

   if (search.message.header.status_code !== 200 || search.message.header.available === 0) return message.channel.send(errorEmbed.setColor('RED').setDescription(locale.NOT_FOUND));

   const name = search.message.body.track_list[0].track.track_name
   const artist = search.message.body.track_list[0].track.artist_name
   const id = search.message.body.track_list[0].track.track_id

   const result = await fetch(`http://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id=${id}&apikey=${client.config.apiKeys.MUSIXMATCH}`).then(res => res.json());

   if (result.message.header.status_code !== 200) return message.channel.send(errorEmbed.setColor('RED').setDescription(`${locale.NOT_FOUND}`));

   const lyrics = result.message.body.lyrics.lyrics_body;
   const footer = result.message.body.lyrics.lyrics_copyright;

   if (lyrics.length > 6000) return message.channel.send(errorEmbed.setColor('RED').setDescription(`${client.branding.emojis.error} ${locale.TOO_MUCH_CHARACTER}`));

   defaultEmbed
   .setTitle(artist + ' - ' + name)
   .setDescription('```' + lyrics + '```')
   .setFooter(footer)
   return message.channel.send(defaultEmbed);

}

module.exports = {
    Name: 'lyrics', 
    Aliases: ['söz'],
    Category: 'Music',
    Description: 'Gets the lyrics of the currently playing or specified song.',
    Cooldown: 3,
    Usage: '[song name]',
    RequiredPerms: [],
    RequiredBotPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    Run: run
}
