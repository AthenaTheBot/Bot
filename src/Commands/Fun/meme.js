const run = async (client, message, args, locale, db) => {

    // Variables
    const { MessageEmbed } = require('discord.js');
    
    const errorEmbed = new MessageEmbed().setColor('RED');
    const alertEmbed = new MessageEmbed().setColor('YELLOW');
    const successEmbed = new MessageEmbed().setColor('GREEN');
    const defaultEmbed = new MessageEmbed().setColor(client.branding.colors.default);

    const fetch = require('node-fetch');

    fetch('https://api.ksoft.si/images/random-meme', {
        headers: {
            'Authorization': 'Bearer ' + client.config.apiKeys.KSOFT
        }
    })
    .then(data => data.json())
    .then(json => {

        defaultEmbed
        .setAuthor(json.author)
        .setURL(json.source)
        .setTitle(json.title)
        .setImage(json.image_url)
        .setFooter(`👍 ${json.upvotes} | 👎 ${json.downvotes} | 💬 ${json.comments}`)
        message.channel.send(defaultEmbed);
        return;

    })
    .catch(err => {
        client.handleError({ commandName: module.exports.Name, channelID: message.channel.id, msg: locale.ERROR_MSG, error: err, print: true });
    })

}

module.exports = {
    Name: 'meme', 
    Aliases: [],
    Category: 'Fun',
    Description: 'Want some memes from reddit ?',
    Cooldown: 4,
    Usage: '',
    RequiredPerms: [],
    RequiredBotPerms: ["EMBED_LINKS", "SEND_MESSAGES"],
    Run: run
}
