const BaseCommand = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');

class Command extends BaseCommand {
    constructor(){
        super({
            name: 'nowplaying',
            aliases: [],
            description: 'Shows the currently playing song',
            category: 'Music',
            usage: null,
            options: [],
            cooldown: 2,
            required_perms: [],
            required_bot_perms: ["SEND_MESSAGES", "READ_MESSAGE_HISTORY"]
        });
    }

    async run(client, msg, args, locale) {

        const Embed = new MessageEmbed();
        const guildState = client.songStates.get(msg.guild.id);

        Embed
        .setColor('#5865F2')
        .setDescription(locale.NOW_PLAYING.replace('$song', `[${guildState.queue[0].title}](${guildState.queue[0].url})`))

        msg.reply({ embeds: [ Embed ] });

        return;
    }
}

module.exports = Command;