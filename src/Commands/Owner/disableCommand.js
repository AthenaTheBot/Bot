const run = async (client, message, args) => {

    // Variables
    const { MessageEmbed } = require('discord.js');
    
    const errorEmbed = new MessageEmbed().setColor('RED');
    const alertEmbed = new MessageEmbed().setColor('YELLOW');
    const successEmbed = new MessageEmbed().setColor('GREEN');
    const defaultEmbed = new MessageEmbed().setColor(client.branding.colors.default);
    
    const command = client.commands.get(args[0]);

    if (!command || !args[0]) return message.channel.send('Invalid command provided!');

    client.commands.delete(command.Name);

    return message.channel.send('Commands has been disabled!');
    
}

module.exports = {
    Name: 'disableCommand', 
    Aliases: [],
    Category: 'Owner',
    Description: '',
    Cooldown: 4,
    Usage: '[command]',
    RequiredPerms: [],
    RequiredBotPerms: [],
    Run: run
}
