const run = async (client, message, args, locale, db) => {

    // Variables
    const { MessageEmbed } = require('discord.js');
    
    const errorEmbed = new MessageEmbed().setColor('RED');
    const alertEmbed = new MessageEmbed().setColor('YELLOW');
    const successEmbed = new MessageEmbed().setColor('GREEN');
    const defaultEmbed = new MessageEmbed().setColor(client.branding.colors.default);

    const guildMusicState = await client.guildQueues.get(message.guild.id);

    if (!guildMusicState || !guildMusicState.playing || guildMusicState.queue.length === 0) return message.channel.send(errorEmbed.setDescription(`${client.branding.emojis.error} ${locale.ALREADY_NOT_PLAYING}`));

    if (!message.member.voice.channel) message.member.voice.channel.id = null;

    if (message.guild.me.voice.channel.id !== message.member.voice.channel.id) return message.channel.send(errorEmbed.setDescription(`${client.branding.emojis.error} ${locale.NOT_SAME_VC}`));

    const playCommand = client.commands.get('play');

    const newQueue = new Array();

    guildMusicState.queue.forEach(song => { newQueue.push(song) });

    newQueue.shift();

    if (!newQueue || newQueue === undefined || newQueue === null || newQueue.length === 0) {
        if (!guildMusicState.playing) return message.channel.send(errorEmbed.setDescription(`${client.branding.emojis.error} ${locale.NO_MUSIC_TO_SKIP}`));
        
        client.guildQueues.delete(message.guild.id);

        message.guild.me.voice.channel.leave();
        
        return message.channel.send(defaultEmbed.setDescription(locale.QUEUE_ENDED))
    }

    client.guildQueues.set(message.guild.id, {
        playing: false,
        queue: newQueue
    })

    message.channel.send(locale.SKIPPED_SONG);

    return playCommand.playSong();

}

module.exports = {
    Name: 'skip', 
    Aliases: ['geç', 's'],
    Category: 'Music',
    Description: '',
    Cooldown: 4,
    Usage: '',
    RequiredPerms: [],
    RequiredBotPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    Run: run
}
