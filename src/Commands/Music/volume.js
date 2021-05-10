const run = async (client, message, args, locale, db) => {

    // Variables
    const { MessageEmbed } = require('discord.js');
    
    const errorEmbed = new MessageEmbed().setColor('RED');
    const alertEmbed = new MessageEmbed().setColor('YELLOW');
    const successEmbed = new MessageEmbed().setColor('GREEN');
    const defaultEmbed = new MessageEmbed().setColor(client.branding.colors.default);

    const guildMusicState = await client.guildMusicStates.get(message.guild.id);

    if (!guildMusicState || !guildMusicState.playing || guildMusicState.queue.length === 0) return message.channel.send(errorEmbed.setDescription(`${client.branding.emojis.error} ${locale.ALREADY_NOT_PLAYING}`));

    if (!message.member.voice.channel) message.member.voice.channel.id = null;

    if (message.guild.me.voice.channel.id !== message.member.voice.channel.id) return message.channel.send(errorEmbed.setDescription(`${client.branding.emojis.error} ${locale.NOT_SAME_VC}`));

    if (!args[0] || isNaN(args[0]) ) return message.channel.send(errorEmbed.setDescription(`${client.branding.emojis.error} ${locale.INVALID_NUMBER}`));

    if (args[0] > 0 && args[0] <= 100) {

        guildMusicState.player.setVolume(args[0] * 0.01);

        return message.channel.send(defaultEmbed.setDescription(locale.SET_VOLUME.replace('$volume', args[0])));

    } else {

        return message.channel.send(errorEmbed.setDescription(`${client.branding.emojis.error} ${locale.INVALID_NUMBER}`));
    } 

}

module.exports = {
    Name: 'volume', 
    Aliases: ['ses', 'vol'],
    Category: 'Music',
    Description: 'Sets the volume of the music.',
    Cooldown: 4,
    Usage: 'amount (1-100)',
    RequiredPerms: [],
    RequiredBotPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    Run: run
}
