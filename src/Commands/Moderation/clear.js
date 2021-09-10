const BaseCommand = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');

class Command extends BaseCommand {
    constructor(){
        super({
            name: 'clear',
            aliases: ["purge"],
            description: 'Clears the specified amount of message from the command channel.',
            category: 'Moderation',
            usage: null,
            options: [],
            cooldown: 2,
            required_perms: ["MANAGE_MESSAGES"],
            required_bot_perms: ["SEND_MESSAGES", "READ_MESSAGE_HISTORY", "MANAGE_MESSAGES"]
        });
    }

    async run(client, msg, args, locale) {

        const Embed = new MessageEmbed().setColor("#5865F2");
        let deleteCount = 0;
        let clearMsg;
    
        if (!args[0] || isNaN(args[0]) || args[0] <= 0) return msg.reply({ embeds: [ Embed.setDescription(`${locale.INVALID_AMOUT}`) ] });
    
        if (args[0] > 100) {
    
            const loopCount = `${Math.trunc(args[0] / 100)}`;
            let remainder = `${args[0] / 100}`.split(`${loopCount}.`).pop()
    
            if (Number.isInteger(args[0] / 100)) {
    
                remainder = null;
    
            } else {
    
                if (remainder.startsWith('0'))  remainder = `${remainder.split('0').pop()}`;
    
            }
    
            for (var i = 1; i <= loopCount; i++) {
    
                const msg1 = await msg.channel.bulkDelete(100).catch(err => {});
                deleteCount = deleteCount + msg1.size;
            }
    
            if (remainder != null && remainder > 0) { 
    
                const msg2 = await msg.channel.bulkDelete(remainder).catch(err => {});
                deleteCount = deleteCount + msg2.size;
            }
    
            clearMsg = await msg.reply(locale.SUCCESS.replace('$count', deleteCount))
    
        } else {
    
            const msg3 = await msg.channel.bulkDelete(args[0]).catch(err => {});
    
            deleteCount = deleteCount + msg3.size;
    
            clearMsg = await msg.reply(locale.SUCCESS.replace('$count', deleteCount))
        
        }

        setTimeout(() => {
            clearMsg?.delete();
        }, 1700)
    }
}

module.exports = Command;