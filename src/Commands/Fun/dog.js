const run = async (client, message, args, locale, db) => {

    // Variables
    const { MessageEmbed } = require('discord.js');
    
    const errorEmbed = new MessageEmbed().setColor('RED');
    const alertEmbed = new MessageEmbed().setColor('YELLOW');
    const successEmbed = new MessageEmbed().setColor('GREEN');
    const defaultEmbed = new MessageEmbed().setColor(client.branding.colors.default);

    const fetch = require('node-fetch');

    fetch('https://dog.ceo/api/breeds/image/random').then(res => res.json())
    .then(data => {

        if (data.status !== 'success') return message.channel.send(errorEmbed.setDescription(locale.ERROR_MSG));

        const image = data.message;
        return message.channel.send(defaultEmbed.setImage(image).setTitle(locale.TITLE));

    }).catch(err => {
        client.handleError({ type: 1, commandName: module.exports.Name, channelID: message.channel.id, msg: locale.ERROR_MSG, error: err, print: true });
    })

}

module.exports = {
    Name: 'dog', 
    Aliases: ['köpek'],
    Category: 'Fun',
    Description: 'Random dog images gooo!',
    Cooldown: 4,
    Usage: '',
    RequiredPerms: [],
    RequiredBotPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    Run: run
}
