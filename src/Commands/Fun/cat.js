const BaseCommand = require('../../Structures/Command');
const { MessageAttachment } = require('discord.js');
const fetch = require('node-fetch');

class Command extends BaseCommand {
    constructor(){
        super({
            name: 'cat',
            aliases: [],
            description: 'Want to see some cute cats?',
            category: 'Fun',
            usage: null,
            options: [],
            cooldown: 2,
            required_perms: [],
            required_bot_perms: ["SEND_MESSAGES", "READ_MESSAGE_HISTORY", "ATTACH_FILES"]
        });
    }

    async run(client, msg, args, locale) {
    
        fetch('https://api.thecatapi.com/v1/images/search').then(res => res.json())
        .then(data => {
    
            const attachment = new MessageAttachment(data[0].url, 'cat.png');
            return msg.reply({ files: [ attachment ] });

        });
    }
}

module.exports = Command;