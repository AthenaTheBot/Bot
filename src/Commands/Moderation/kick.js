const BaseCommand = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');

class Command extends BaseCommand {
    constructor(){
        super({
            name: 'kick',
            aliases: [],
            description: 'Kicks the mentioned member.',
            category: 'Moderation',
            usage: "[@member] [reason]",
            options: [],
            cooldown: 2,
            required_perms: ["KICK_MEMBERS"],
            required_bot_perms: ["SEND_MESSAGES", "READ_MESSAGE_HISTORY", "KICK_MEMBERS"]
        });
    }

    async run(client, msg, args, locale) {

    const Embed = new MessageEmbed().setColor("#5865F2");
    const mentionedMember = msg.mentions.members.first();
    let reason = args.slice(1).join(' ');

    if (!mentionedMember) return msg.reply({ embeds: [ Embed.setDescription(`${locale.NO_MENTION}`) ] });

    if (mentionedMember.id === msg.author.id) return msg.reply({ embeds: [ Embed.setDescription(`${locale.CANNOT_KICK_YOURSELF}`) ] });

    if (mentionedMember.id === client.user.id) return msg.reply({ embeds: [ Embed.setDescription(`${locale.CANNOT_KICK_MYSELF}`) ] });

    let rawPos1;
    if (!msg.member.roles) rawPos1 = 0;
    else rawPos1 = msg.member.roles.highest.rawPosition;

    let rawPos2;
    if (!mentionedMember.roles) rawPos2 = 0;
    else rawPos2 = mentionedMember.roles.highest.rawPosition;

    let rawPos3;
    if (!msg.guild.me.roles) rawPos3 = 0;
    else rawPos3 = msg.guild.me.roles.highest.rawPosition;

    if (mentionedMember.id === msg.guild.ownerID) return msg.reply({ embeds: [ Embed.setDescription(`${locale.NOT_ENOUGH_PERMS}`) ] });

    if (rawPos1 > rawPos2 || msg.author.id === msg.guild.ownerID) {

        if (rawPos3 < rawPos2) return msg.reply({ embeds: [ Embed.setDescription(`${locale.BOT_NOT_ENOUGH_PERMS}`) ] });

        try {
            
            msg.guild.members.cache.get(mentionedMember.id).kick(reason);
        } catch (err) {
            return msg.reply({ embeds: [ Embed.setDescription(`${locale.ERROR_MSG}`) ] });
        }

        return msg.reply({ embeds: [ Embed.setDescription(`**${mentionedMember.user.username}#${mentionedMember.user.discriminator}**, ${locale.SUCCESSFUL}`) ] });

    } else {

        return msg.reply({ embeds: [ Embed.setDescription(`${locale.NOT_ENOUGH_PERMS}`) ] });
    }

    }
}

module.exports = Command;