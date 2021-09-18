const BaseCommand = require('../../Structures/Command');
const { MessageAttachment } = require('discord.js');
const canvacord = require('canvacord')

class Command extends BaseCommand {
    constructor(){
        super({
            name: 'jail',
            aliases: [],
            description: 'Jail!??',
            category: 'Fun',
            usage: '@member',
            options: [],
            cooldown: 2,
            required_perms: [],
            required_bot_perms: ["SEND_MESSAGES", "READ_MESSAGE_HISTORY", "ATTACH_FILES"]
        });
    }

    async run(client, msg, args, locale) {

        const user = msg.mentions.users.first() || msg.author;
        const jail = await canvacord.Canvas.jail(user.displayAvatarURL({ format: "png", dynamic: false }), false);
        const attachment = new MessageAttachment(jail, "jail.png");
    
        return msg.reply({ files: [ attachment ] });
    }
}

module.exports = Command;