const run = async (client, message, args, locale, db) => {

    // Variables
    const { MessageEmbed } = require('discord.js');
    
    const errorEmbed = new MessageEmbed().setColor('RED');
    const alertEmbed = new MessageEmbed().setColor('YELLOW');
    const successEmbed = new MessageEmbed().setColor('GREEN');
    const defaultEmbed = new MessageEmbed().setColor(client.branding.colors.default);

    const guildMusicState = await client.guildMusicStates.get(message.guild.id);

    if (!guildMusicState || !guildMusicState.playing || guildMusicState.queue.length === 0) return message.channel.send(errorEmbed.setDescription(`${client.branding.emojis.error} ${locale.ALREADY_NOT_PLAYING}`));

    const guildQueue = guildMusicState.queue;
    let currentQueue = new Array();

    let int = 1;
    guildQueue.forEach(song => {
        if (song === guildQueue[0]) {

            return currentQueue.push(`${int++} - [${song.title}](${song.url}) - ${locale.CURRENTLY_PLAYING}`);
        }

        return currentQueue.push(`${int++} - [${song.title}](${song.url})`);
    })

    defaultEmbed
    .setDescription(`**${message.guild.name}** - ${locale.TITLE} \n ──────────────────────────── \n ${currentQueue.join('\n')}`)

    return message.channel.send(defaultEmbed);
}

module.exports = {
    Name: 'queue', 
    Aliases: ['sıra', 'sira', 'q'],
    Category: 'Music',
    Description: '',
    Cooldown: 2,
    Usage: '',
    RequiredPerms: [],
    RequiredBotPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    Run: run
}
