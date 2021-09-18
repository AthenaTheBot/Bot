const BaseCommand = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');

class Command extends BaseCommand {
    constructor(){
        super({
            name: 'coinflip',
            aliases: [],
            description: 'Flip a coin and see the result.',
            category: 'Fun',
            usage: '@member',
            options: [],
            cooldown: 1.5,
            required_perms: [],
            required_bot_perms: ["SEND_MESSAGES", "READ_MESSAGE_HISTORY"]
        });
    }

    async run(client, msg, args, locale) {

        const Embed = new MessageEmbed().setColor('#5865F2');
        const int = Math.floor(Math.random() * 2);
    
        Embed
        .setColor('RANDOM')
        .setTitle(locale.TITLE)
        .setImage('https://media.giphy.com/media/FfrlRYkqKY1lC/giphy.gif')
        const flippingMessage = await msg.reply({ embeds: [ Embed ] });
        
        if (int === 1) {
            setTimeout(() => {  
                flippingMessage.delete().catch(err => {});
                msg.reply(locale.RESULT1);
            }, 2500);
            return;
        } else return setTimeout(() => { msg.reply(locale.RESULT2) }, 2500);
    }
}

module.exports = Command;