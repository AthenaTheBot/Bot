const BaseCommand = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');

class Command extends BaseCommand {
    constructor(){
        super({
            name: 'slowmode',
            aliases: ['smode'],
            description: 'Sets slowmode on the command channel.',
            category: 'Moderation',
            usage: "[amount: 10s, 3m, 1h, etc.]",
            options: [{
                type: 'STRING',
                name: 'timeout',
                description: 'Slowmode timeout amount.',
                required: true
            }],
            cooldown: 2,
            required_perms: ["MANAGE_CHANNELS"],
            required_bot_perms: ["SEND_MESSAGES", "READ_MESSAGE_HISTORY", "MANAGE_CHANNELS"]
        });
    }

    async run(client, msg, args, locale) {

        const Embed = new MessageEmbed().setColor('#5865F2');
    
        if (!args[0]) return msg.reply({ embeds: [ Embed.setDescription(locale.SPECIFY_ARG) ] });
    
        if (args[0] === 'off' || args[0] === 'kapat' || args[0] === 'disable' || args[0] === '0' || args[0] === '0s' || args[0] === '0m' || args[0] === '0h') {
    
            try {

                msg.channel.setRateLimitPerUser(0);
            }
            catch(err) {
                
                return msg.reply({ embeds: [ Embed.setDescription(locale.ERROR_MSG) ] })
            }
    
            return msg.reply({ embeds: [ Embed.setDescription(locale.SUCCESSFUL_OFF) ] });
        }
    
        let val;
        let value;
        if (args[0].endsWith('s')) {val = args[0].split('s')[0]; value = `${args[0].split('s')[0]} ${locale.SECONDS}` };
        if (args[0].endsWith('m')) {val = args[0].split('m')[0] * 60; value = `${args[0].split('m')[0]} ${locale.MINUTES}` };
        if (args[0].endsWith('h')) {val = args[0].split('h')[0] * 3600; value = `${args[0].split('h')[0]} ${locale.HOURS}` };
    
        if (!val || val === null || val === undefined) return msg.reply({ embeds: [ Embed.setDescription(locale.SPECIFY_ARG) ] });
    
        try {

            msg.channel.setRateLimitPerUser(val);
        }
        catch(err) {

            return msg.reply({ embeds: [ Embed.setDescription(locale.ERROR_MSG) ] })
        }
    
        return msg.reply({ embeds: [ Embed.setDescription(locale.SUCCESSFUL_ON.replace('$value', value)) ] });
    }
}

module.exports = Command;