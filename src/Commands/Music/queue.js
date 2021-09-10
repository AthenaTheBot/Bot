const BaseCommand = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
let messages = [];

class Command extends BaseCommand {
    constructor(){
        super({
            name: 'queue',
            aliases: ['q'],
            description: 'Command for showing current song queue.',
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

        const displayArray = new Array();

        let count = 0;
        guildState.queue.forEach((song) => {
            count++;
            displayArray.push(`${count} - [${song.title.length > 50 ? song.title.slice(0, 50) + '..' : song.title}](${song.url}) ${count == 1 ? ' - **Currently Playing**' : ''}`);
        })

        Embed
        .setColor('#5865F2')
        .setDescription(`**${msg.guild.name.length > 30 ? msg.guild.name.slice(0, 30) + '..' : msg.guild.name}** - ${locale.TITLE} \n ─────────────────────────────────── \n ${displayArray.slice(0, 25).join('\n')}`);

        msg.reply({ embeds: [ Embed ] })

        if (displayArray.length > 25) {
            const check = Math.abs(displayArray.length / 25);
            let last = 2;
            for (var i = 0; i < check; i++) {
                const secondNum = 25 * last;
                Embed
                .setDescription(`**${msg.guild.name.length > 30 ? msg.guild.name.slice(0, 30) + '..' : msg.guild.name}** - ${locale.TITLE} \n ─────────────────────────────────── \n ${displayArray.slice(secondNum, secondNum + 25).join('\n')}`);
                msg.reply({ embeds: [ Embed ] })
                if (secondNum + 25 > displayArray.length) break;
                last++;
            }
        }

    }
}

module.exports = Command;