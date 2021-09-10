const BaseCommand = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');

class Command extends BaseCommand {
    constructor(){
        super({
            name: 'help',
            aliases: [],
            description: 'Command for getting basic information about Athena.',
            category: 'Misc',
            usage: null,
            options: [],
            cooldown: 2,
            required_perms: [],
            required_bot_perms: ["SEND_MESSAGES", "READ_MESSAGE_HISTORY"]
        });
    }

    async run(client, msg, args, locale) {
    
        const Embed = new MessageEmbed()
        .setColor("#5865F2")
        .setThumbnail(client.user.displayAvatarURL({ size: 4096, format: 'png', dynamic: true }))
        .setTitle(locale.TITLE)
        .setDescription(`
            ${locale.HEAD_MSG_1}

            ${locale.HEAD_MSG_2}

            **${locale.LINKS}**: 
            [${locale.OUR_WEBSITE}](https://athenabot.site)
            [${locale.COMMANDS_PAGE}](https://athenabot.site/commands)
            [${locale.INVITE_ATHENA}](https://athenabot.site/invite)
            [${locale.SUPPORT_SERVER}](https://athenabot.site/support)
        `);
        return msg.reply({ embeds: [ Embed ] });
    
    }
}

module.exports = Command;