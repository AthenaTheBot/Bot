const run = async (client, message, args, locale, db) => {

    // Variables
    const { MessageEmbed } = require('discord.js');
    
    const errorEmbed = new MessageEmbed().setColor('RED');
    const alertEmbed = new MessageEmbed().setColor('YELLOW');
    const successEmbed = new MessageEmbed().setColor('GREEN');
    const defaultEmbed = new MessageEmbed().setColor(client.branding.colors.default);

    const fetch = require('node-fetch');

    fetch('https://api.thecatapi.com/v1/images/search').then(res => res.json())
    .then(data => {

        const image = data[0].url;
        return message.channel.send(defaultEmbed.setImage(image).setTitle(locale.TITLE));

    }).catch(err => {
        client.handleError({ commandName: module.exports.Name, channelID: message.channel.id, msg: locale.ERROR_MSG, error: err, print: true });
    })

}

module.exports = {
    Name: 'cat', 
    Aliases: ['kedi'],
    Category: 'Fun',
    Description: 'Random cat images gooo!',
    Cooldown: 4,
    Usage: '',
    RequiredPerms: [],
    RequiredBotPerms: ["ATTACH_FILES", "SEND_MESSAGES"],
    Run: run
}
