const run = async (client, message, args) => {

    // Variables
    const { MessageEmbed } = require('discord.js');
    
    const errorEmbed = new MessageEmbed().setColor('RED');
    const alertEmbed = new MessageEmbed().setColor('YELLOW');
    const successEmbed = new MessageEmbed().setColor('GREEN');
    const defaultEmbed = new MessageEmbed().setColor(client.branding.colors.default);

    defaultEmbed
    .setDescription(`Server count: \`${client.guilds.cache.size}\` \n Client user count: \`${client.users.cache.size}\``);

    return message.channel.send(defaultEmbed);
}

module.exports = {
    Name: 'stats', 
    Aliases: [],
    Category: 'Owner',
    Description: '',
    Cooldown: 4,
    Usage: '',
    RequiredPerms: [],
    RequiredBotPerms: [],
    Run: run
}
