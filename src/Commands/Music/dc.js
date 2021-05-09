const run = async (client, message, args, locale, db) => {

    // Variables
    const { MessageEmbed } = require('discord.js');
    
    const errorEmbed = new MessageEmbed().setColor('RED');
    const alertEmbed = new MessageEmbed().setColor('YELLOW');
    const successEmbed = new MessageEmbed().setColor('GREEN');
    const defaultEmbed = new MessageEmbed().setColor(client.branding.colors.default);

    if (!message.guild.me.voice.channel) return message.channel.send(errorEmbed.setDescription(`${client.branding.emojis.error} ${locale.ALREADY_NOT_IN_VC}`));

    if (!message.member.voice.channel) message.member.voice.channel.id = null;

    if (message.guild.me.voice.channel.id !== message.member.voice.channel.id) return message.channel.send(errorEmbed.setDescription(`${client.branding.emojis.error} ${locale.NOT_SAME_VC}`));

    try {

        message.guild.me.voice.channel.leave();

        const guildMusicState = await client.guildQueues.get(message.guild.id);

        if (!guildMusicState) return;

        client.guildQueues.set(message.guild.id, {
            playing: false,
            queue: guildMusicState.queue
        })

        setTimeout(async () => {

            const check = await client.guildQueues.get(message.guild.id);

            if (check.playing) return;
            else {

                client.guildQueues.delete(message.guild.id);
            }

        }, 18000000);

    } catch (err) {
        return client.handleError({ commandName: module.exports.Name, error: err, print: true });
    }

    return message.react('👍').catch(err => {});
}

module.exports = {
    Name: 'dc', 
    Aliases: ['disconnect', 'çık'],
    Category: 'Music',
    Description: '',
    Cooldown: 1,
    Usage: '',
    RequiredPerms: [],
    RequiredBotPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    Run: run
}
