const BaseCommand = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

class Command extends BaseCommand {
    constructor(){
        super({
            name: 'meme',
            aliases: [],
            description: 'Want some sweet memes from reddit? Cause i do!',
            category: 'Fun',
            usage: null,
            options: [],
            cooldown: 2,
            required_perms: [],
            required_bot_perms: ["SEND_MESSAGES", "READ_MESSAGE_HISTORY"]
        });
    }

    async run(client, msg, args, locale) {
        
        const Embed = new MessageEmbed().setColor("#5865F2");
    
        fetch('https://api.ksoft.si/images/random-meme', {
            headers: {
                'Authorization': 'Bearer ' + client.config.API_KEYS.KSOFT
            }
        })
        .then(data => data.json())
        .then(json => {
    
            Embed
            .setAuthor(json.author)
            .setURL(json.source)
            .setTitle(json.title)
            .setImage(json.image_url)
            .setFooter(`👍 ${json.upvotes} | 👎 ${json.downvotes} | 💬 ${json.comments}`)
            msg.reply({ embeds: [ Embed ] });
            return;
    
        });
    }
}

module.exports = Command;