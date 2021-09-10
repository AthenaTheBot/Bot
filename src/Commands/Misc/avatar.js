const BaseCommand = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');

class Command extends BaseCommand {
    constructor(){
        super({
            name: 'avatar',
            aliases: [],
            description: 'Shows the mentioned user\'s avatar.',
            category: 'Misc',
            usage: "[@user]",
            options: [{
                type: 'USER',
                name: 'user',
                description: 'User',
                required: true
            }],
            cooldown: 2,
            required_perms: [],
            required_bot_perms: ["SEND_MESSAGES", "READ_MESSAGE_HISTORY"]
        });
    }

    async run(client, msg, args, locale) {

        const user = msg.mentions.users.first() || msg.author;
        const Embed = new MessageEmbed();

        Embed
        .setColor('#5865F2')
        .setTitle(locale.TITLE.replace('$user', user.username))
        .setImage(user.displayAvatarURL({ format: 'png', size: 4096, dynamic: true }));
        return msg.reply({ embeds: [ Embed ] }).catch(err => {})
    }
}

module.exports = Command;