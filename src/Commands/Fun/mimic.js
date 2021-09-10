const BaseCommand = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');


class Command extends BaseCommand {
    constructor(){
        super({
            name: 'mimic',
            aliases: [],
            description: 'Someone said that nowaday bots can mimic users.',
            category: 'Fun',
            usage: "[@member] [text]",
            options: [],
            cooldown: 2,
            required_perms: [],
            required_bot_perms: ["SEND_MESSAGES", "READ_MESSAGE_HISTORY"]
        });
    }

    async run(client, msg, args, locale) {
        
        const Embed = new MessageEmbed().setColor("#5865F2");
        let mention = msg.mentions.users.first();
        const str = args.slice(1).join(' ');
    
        if (!args[0]) return msg.reply({ embeds: [ Embed.setDescription(`${locale.INVALID_MEMBER}`) ] });
    
        let targetID;
        if (mention) targetID = mention.id;
        else {
            const check = msg.guild.members.cache.get(args[0]);
            if (!check) return msg.reply({ embeds: [ Embed.setDescription(`${locale.INVALID_MEMBER}`) ] });
            else targetID = check.id;
        }
    
        if (!str) return msg.reply({ embeds: [ Embed.setDescription(`${locale.INVALID_MSG}`) ] });
    
        msg.delete().catch(err => {});
    
        const target = msg.guild.members.cache.get(targetID);
    
        const webhook = await msg.channel.createWebhook(target.user.username, { avatar: target.user.displayAvatarURL(), reason: 'Mimic command.' }).catch(err => {});
    
        webhook.send(str).catch(err => {});
    
        setTimeout(() => {
    
            webhook.delete('Mimic command.').catch(err => {});
        }, 3000);
    }
}

module.exports = Command;