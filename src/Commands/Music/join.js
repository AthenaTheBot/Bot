const run = async (client, message, args, locale, db) => {

    // Variables
    const { MessageEmbed } = require('discord.js');
    
    const errorEmbed = new MessageEmbed().setColor('RED');
    const alertEmbed = new MessageEmbed().setColor('YELLOW');
    const successEmbed = new MessageEmbed().setColor('GREEN');
    const defaultEmbed = new MessageEmbed().setColor(client.branding.colors.default);

    const guildMusicState = client.guildMusicStates.get(message.guild.id);

    if (guildMusicState && guildMusicState.playing) return message.channel.send(errorEmbed.setDescription(`${client.branding.emojis.error} ${locale.ALREADY_BEING_USED}`));

    if (!message.member.voice.channel) return message.channel.send(errorEmbed.setDescription(`${client.branding.emojis.error} ${locale.NOT_IN_VC}`));

    try {

        await message.member.voice.channel.join();
    }
    catch (err) {

        return client.handleError({ commandName: module.exports.Name, channelID: message.channel.id, msg: locale.ERROR_MSG, error: err, print: false });
    }

    return message.react('👍').catch(err => {});

}

module.exports = {
    Name: 'join', 
    Aliases: ['katıl', 'katil', 'j'],
    Category: 'Music',
    Description: 'Simple command that makes Athena join your vc.',
    Cooldown: 2,
    Usage: '',
    RequiredPerms: [],
    RequiredBotPerms: ["CONNECT", "SPEAK", "SEND_MESSAGES", "EMBED_LINKS"],
    Run: run
}
