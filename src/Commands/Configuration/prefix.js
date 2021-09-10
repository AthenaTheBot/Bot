const BaseCommand = require('../../Structures/Command');

const { MessageEmbed } = require('discord.js');

class Command extends BaseCommand {
    constructor(){
        super({
            name: 'prefix',
            aliases: [],
            description: 'Command for setting prefix.',
            category: 'Configuration',
            usage: '[prefix]',
            options: [{
                type: 'STRING',
                name: 'prefix',
                description: 'Prefix that you want to change.',
                required: false
            }],
            cooldown: 4,
            required_perms: [],
            required_bot_perms: ["SEND_MESSAGES", "EMBED_LINKS", "READ_MESSAGE_HISTORY"]
        });
    }

    async run(client, msg, args, locale){

        const Embed = new MessageEmbed().setColor('#5865F2');
        const guildData = await client.dbManager.getGuild(msg.guild.id);
        
        if (!args[0]) return msg.reply({ embeds: [Embed.setDescription(locale.PREFIX_INFO.replace('$prefix', guildData.data.preferences.prefix))] });

        try {

            await client.dbManager.updateDocument('guild', msg.guild.id, { $set: { "data.preferences.prefix": args[0].trim() } });
        }
        catch(err){

            client.log(2, err);
            return msg.reply({ embeds: [
                Embed.setDescription(locale.ERROR)
            ] });
        };

        return msg.reply({ embeds: [
            Embed.setDescription(locale.SUCCESS.replace('$prefix', args[0].trim()))
        ] });
    }
}

module.exports = Command;