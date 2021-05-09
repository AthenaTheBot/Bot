const run = async (client, message, args) => {

    // Variables
    const { MessageEmbed } = require('discord.js');
    
    const errorEmbed = new MessageEmbed().setColor('RED');
    const alertEmbed = new MessageEmbed().setColor('YELLOW');
    const successEmbed = new MessageEmbed().setColor('GREEN');
    const defaultEmbed = new MessageEmbed().setColor(client.branding.colors.default);
    
    try {

        const command = require(`../../Commands/${args[0]}/${args[1]}`);

        client.commands.set(command.Name, command);
        command.Aliases.forEach(alias => { client.commandAliases.set(alias, command) });
    }
    catch (err) {
        if (err.code == 'MODULE_NOT_FOUND') return message.channel.send('Invalid command name or category provided!');
        else {

            return message.channel.send('An error occured while trying to add the command! \n ```\n' + err + '```');
        }
    }

    return message.channel.send('Command has been added!');

}

module.exports = {
    Name: 'addCommand', 
    Aliases: [],
    Category: 'Owner',
    Description: '',
    Cooldown: 4,
    Usage: '',
    RequiredPerms: [],
    RequiredBotPerms: [],
    Run: run
}
