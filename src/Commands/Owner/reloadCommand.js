const run = async (client, message, args) => {

    // Variables
    const { MessageEmbed } = require('discord.js');
    
    const errorEmbed = new MessageEmbed().setColor('RED');
    const alertEmbed = new MessageEmbed().setColor('YELLOW');
    const successEmbed = new MessageEmbed().setColor('GREEN');
    const defaultEmbed = new MessageEmbed().setColor(client.branding.colors.default);
    
    const command = client.commands.get(args[0]);

    if (!args[0] || !command) return message.channel.send('Invalid command provided!');

    delete require.cache[require.resolve(`./../../Commands/${command.Category}/${command.Name}.js`)];

    const newCommandFile = require(`./../../Commands/${command.Category}/${command.Name}.js`);

    client.commands.set(command.Name, newCommandFile);

    return message.channel.send('Command has been reloaded!');
}

module.exports = {
    Name: 'reloadCommand', 
    Aliases: [],
    Category: 'Owner',
    Description: '',
    Cooldown: 4,
    Usage: '[command]',
    RequiredPerms: [],
    RequiredBotPerms: [],
    Run: run
}
