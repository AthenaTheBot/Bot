const run = async (client, message, args, locale, db) => {

    // Variables
    const { MessageEmbed, Collection } = require('discord.js');
    
    const errorEmbed = new MessageEmbed().setColor('RED');
    const alertEmbed = new MessageEmbed().setColor('YELLOW');
    const successEmbed = new MessageEmbed().setColor('GREEN');
    const defaultEmbed = new MessageEmbed().setColor(client.branding.colors.default);

    if (args[0]) {

        if (client.commands.has(args[0]) || client.commandAliases.has(args[0])) {

            let guildData = await client.db.manager.getGuild(message.guild);
            let prefix = guildData.data.preferences.prefix;
            if (!prefix) prefix = '!';

            let Command;
            if (client.commands.has(args[0])) Command = client.commands.get(args[0]);
            else Command = client.commandAliases.get(args[0]);

            let Description;
            if (Command.Description.length > 0) Description = Command.Description;
            else Description = locale.NONE;

            let RequiredPerms;
            if (Command.RequiredPerms.length > 0) RequiredPerms = `\`${Command.RequiredPerms.join('`, `')}\``;
            else RequiredPerms = locale.NONE;

            let Aliases;
            if (Command.Aliases.length > 0) Aliases = `\`${Command.Aliases.join('`, `')}\``;
            else Aliases = locale.NONE;

            let Usage; 
            if (Command.Usage.length > 0) Usage = `${prefix}${Command.Name} ${Command.Usage}`;
            else Usage = `\`${prefix}${Command.Name}\``;

            defaultEmbed
            .setTitle(locale.TITLE.replace('$command', Command.Name))
            .addFields(
                { name: locale.COMMAND_DESCRIPTION, value: Description, inline: false },
                { name: locale.COMMAND_USAGE, value: Usage, inline: false },
                { name: locale.COMMAND_ALIASES, value: Aliases, inline: false },
                { name: locale.COMMAND_COOLDOWN, value: `\`${Command.Cooldown}\`s`, inline: false },
                { name: locale.REQUIRED_PERMS, value: RequiredPerms, inline: false },
            )
            return message.channel.send(defaultEmbed);

        } else {

            return message.channel.send(errorEmbed.setDescription(`${client.branding.emojis.error} ${locale.INVALID_COMMAND}`));
        }

    } else {

        const fs = require('fs');
        const folders = fs.readdirSync(`${__dirname}/../`);
    
        const CategoryCommands = new Array();
    
        folders.forEach(category => {
            if (category == 'Owner') return;
            const subCommands = new Array();
            fs.readdirSync(`${__dirname}/../${category}`).filter(x => x.endsWith('.js')).forEach(command => {
                const commandName = command.split('.js')[0];
                if (client.commands.has(commandName)) {
                    subCommands.push(commandName);
                }
            })
            CategoryCommands.push({ category: category, commands: subCommands });
        })
    
        CategoryCommands.forEach(x => {
            defaultEmbed.addField(x.category, '`' + x.commands.join('`, `') + '`', false);
        })
    

        defaultEmbed
        .setTitle(locale.MAIN_TITLE)
        .setDescription(locale.MAIN_DESC)
        .setThumbnail(client.user.displayAvatarURL({ size: 4096, format: 'png', dynamic: true }))
        .setFooter('Athena • ' + client.config.bot.VERSION, message.author.displayAvatarURL())
        .addField('Link(s)', '- [Website](http://athenabot.site) \n - [Support Server](http://athenabot.site/support) \n - [Invite Link](http://athemabot.site/invite)',false)


        return message.channel.send(defaultEmbed);

    }
}

module.exports = {
    Name: 'help', 
    Aliases: ['yardım', 'yardim'],
    Category: 'Misc',
    Description: 'Simple help command to get information about a command or specific command.',
    Cooldown: 1,
    Usage: '',
    RequiredPerms: [],
    RequiredBotPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    Run: run
}
