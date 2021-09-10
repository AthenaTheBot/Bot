const BaseCommand = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');

class Command extends BaseCommand {
    constructor(){
        super({
            name: 'invite',
            aliases: [],
            description: 'Sens the invite link of Athena.',
            category: 'Misc',
            usage: null,
            options: [],
            cooldown: 2,
            required_perms: [],
            required_bot_perms: ["SEND_MESSAGES", "READ_MESSAGE_HISTORY"]
        });
    }

    async run(client, msg, args, locale) {
    
        const Embed = new MessageEmbed().setColor("");
    
        Embed
        .setDescription(locale.MSG.replace('$url', 'https://athenabot.site/invite'));
    
        return msg.reply(defaultEmbed).catch(err => {});
    }
}

module.exports = Command;