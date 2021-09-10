const BaseCommand = require('../../Structures/Command');

const { MessageEmbed } = require('discord.js');
const figlet = require('figlet');

class Command extends BaseCommand {
    constructor(){
        super({
            name: 'ascii',
            aliases: [],
            description: 'Simple command to convert utf-8 formatted text to ascii format.',
            category: 'Misc',
            usage: '[text]',
            options: [{
                type: 'STRING',
                name: 'text',
                description: 'Text to convert.',
                required: true
            }],
            cooldown: 2,
            required_perms: [],
            required_bot_perms: ["SEND_MESSAGES", "EMBED_LINKS", "READ_MESSAGE_HISTORY"]
        });
    }

    async run(client, msg, args, locale){

        const Embed = new MessageEmbed().setColor('BLUE');

        const text = args.join(' ');
        if (!text) return msg.reply({ embeds: [ Embed.setDescription(locale.NO_MSG) ] });

        figlet(text, (err, data) => {
            if (err) return msg.reply({ embeds: [ Embed.setDescription(locale.ERROR) ] });
            return msg.reply('```\n' + data + '\n```');
        });
    }
}

module.exports = Command;