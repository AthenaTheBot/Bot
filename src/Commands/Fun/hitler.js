const BaseCommand = require('../../Structures/Command');
const { MessageAttachment } = require('discord.js');
const canvacord = require('canvacord');

class Command extends BaseCommand {
    constructor(){
        super({
            name: 'hitler',
            aliases: [],
            description: 'Worse than hitler meme.',
            category: 'Fun',
            usage: null,
            options: [],
            cooldown: 2,
            required_perms: [],
            required_bot_perms: ["SEND_MESSAGES", "READ_MESSAGE_HISTORY", "ATTACH_FILES"]
        });
    }

    async run(client, msg, args, locale) {

        const user = msg.mentions.users.first() || msg.author;
        const hitler = await canvacord.Canvas.hitler(user.displayAvatarURL({ format: "png", dynamic: false }));
        const attachment = new MessageAttachment(hitler, "worseThanHitler.png");
    
        return msg.reply({ files:  [ attachment ] });
    }
}

module.exports = Command;