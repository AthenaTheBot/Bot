const BaseCommand = require('../../Structures/Command');

const { MessageEmbed } = require('discord.js');
const { readdirSync } = require('fs');
const { join } = require('path');

class Command extends BaseCommand {
    constructor(){
        super({
            name: 'language',
            aliases: [],
            description: 'Command for setting language.',
            category: 'Configuration',
            usage: '[language]',
            options: [{
                type: 'STRING',
                name: 'language',
                description: 'Language that you want to change.',
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

        const availableLanguages = readdirSync(join(__dirname, '..', '..', 'Locales'));

        if (!args[0]) return msg.reply({ embeds: [Embed.setDescription(locale.LANGUAGE_INFO.replace('$language', guildData.data.preferences.language))] });
        else if (args[0] && !availableLanguages.includes(args[0])) {

            return msg.reply({ embeds: [Embed.setDescription(locale.INVALID_LANGUAGE.replace('$languages', '[`' + availableLanguages.join('`, `') + '`]'))] });
        }

        try {

            await client.dbManager.updateDocument('guild', msg.guild.id, { $set: { "data.preferences.language": args[0].trim() } });
        }
        catch(err){

            client.log(2, err);
            return msg.reply({ embeds: [
                Embed.setDescription(locale.ERROR)
            ] });
        };

        locale = client.locales.get(args[0].trim()).locales.find(lang => lang.cmd == 'language').content;

        return msg.reply({ embeds: [
            Embed.setDescription(locale.SUCCESS.replace('$language', args[0].trim()))
        ] });
    }
}

module.exports = Command;