const run = async (client, message, args, locale, db) => {

    // Variables
    const { MessageEmbed } = require('discord.js');
    
    const errorEmbed = new MessageEmbed().setColor('RED');
    const alertEmbed = new MessageEmbed().setColor('YELLOW');
    const successEmbed = new MessageEmbed().setColor('GREEN');
    const defaultEmbed = new MessageEmbed().setColor(client.branding.colors.default);

}

module.exports = {
    Name: '', 
    Aliases: [],
    Category: '',
    Description: '',
    Cooldown: 4,
    Usage: '',
    RequiredPerms: [],
    RequiredBotPerms: [],
    Run: run
}
