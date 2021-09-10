const BaseCommand = require('../../Structures/Command');
const { MessageAttachment } = require('discord.js');
const canvacord = require('canvacord')

class Command extends BaseCommand {
    constructor(){
        super({
            name: 'trigger',
            aliases: ['triggerd'],
            description: 'Someone looks angry.',
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
        const trigger = await canvacord.Canvas.trigger(user.displayAvatarURL({ format: "png", dynamic: false }), false);
        const attachment = new MessageAttachment(trigger, "trigger.gif");
    
        return msg.reply({ files: [ attachment ] });
    }
}

module.exports = Command;