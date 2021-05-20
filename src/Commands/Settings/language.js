const run = async (client, message, args, locale, db) => {

    // Variables
    const { MessageEmbed } = require('discord.js');
    const fs = require('fs');
    
    const errorEmbed = new MessageEmbed().setColor('RED');
    const alertEmbed = new MessageEmbed().setColor('YELLOW');
    const successEmbed = new MessageEmbed().setColor('GREEN');
    const defaultEmbed = new MessageEmbed().setColor(client.branding.colors.default);

    if (!args[0]) {

        const guildData = await db.manager.getGuild(message.guild);

        let language;
        switch (guildData.data.preferences.language) {
            case 'en-US':
                language = locale.LANG1;
                break;
            case 'tr-TR':
                language = locale.LANG2;
                break;
            default:
                language = locale.LANG1;
                break;
        }

        return message.channel.send(defaultEmbed.setDescription(locale.CURRENT_LANGUAGE.replace('$language', language).replace('$guild', message.guild.name)));

    }

    if (args[0]) {

        const validLanguages = new Array();

        await fs.readdirSync(`${__dirname}/../../Locales`).forEach(x => {

            validLanguages.push(x);
        })

        if (!validLanguages.includes(args[0])) return message.channel.send(errorEmbed.setDescription(`${client.branding.emojis.error} ${locale.INVALID_LANGUAGE.replace('$languages', validLanguages)}`));

        try {
            await db.manager.setValue({ collection: 'servers', query: { _id: message.guild.id }, operation: { $set: { "data.preferences.language": args[0] } } });

        } catch (err) {
            return client.handleError({ commandName: module.exports.Name, channelID: message.channel.id, msg: locale.ERROR_MSG, error: err });
        }

        locale = require(`../../Locales/${args[0]}/${module.exports.Category}/${module.exports.Name}`);

        return message.channel.send(successEmbed.setDescription(`${client.branding.emojis.success} ${locale.SUCCESS}`));
    }
}

module.exports = {
    Name: 'language', 
    Aliases: ['dil', "DİL"],
    Category: 'Settings',
    Description: 'Sets the guild language.',
    Cooldown: 1,
    RequiredPerms: ["ADMINISTRATOR"],
    RequiredBotPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    Run: run
}