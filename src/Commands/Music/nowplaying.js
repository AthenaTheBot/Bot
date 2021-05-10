const run = async (client, message, args, locale, db) => {

    // Variables
    const { MessageEmbed } = require('discord.js');
    
    const errorEmbed = new MessageEmbed().setColor('RED');
    const alertEmbed = new MessageEmbed().setColor('YELLOW');
    const successEmbed = new MessageEmbed().setColor('GREEN');
    const defaultEmbed = new MessageEmbed().setColor(client.branding.colors.default);

    const guildMusicState = await client.guildMusicStates.get(message.guild.id);

    if (!guildMusicState || !guildMusicState.playing || guildMusicState.queue.length === 0) return message.channel.send(errorEmbed.setDescription(`${client.branding.emojis.error} ${locale.ALREADY_NOT_PLAYING}`));

    const queue = guildMusicState.queue;

    return message.channel.send(defaultEmbed.setDescription(`${locale.CURRENTLY_PLAYING}[${queue[0].title}](${queue[0].url})`));
}

module.exports = {
    Name: 'nowplaying', 
    Aliases: ['np', 'şaundaçalıyor', 'çalanşarkı'],
    Category: 'Music',
    Description: 'Shows the song currently playing.',
    Cooldown: 2,
    Usage: '',
    RequiredPerms: [],
    RequiredBotPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    Run: run
}
