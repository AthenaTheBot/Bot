const run = async (client, message, args, locale) => {

    return message.channel.send(locale.MSG.replace('$ping', client.ws.ping));
}

module.exports = {
    Name: 'ping', 
    Aliases: [],
    Category: 'Misc',
    Description: 'Simple ping pong command to check if bot is alive or not.',
    Cooldown: 1,
    Usage: '',
    RequiredPerms: [],
    RequiredBotPerms: ["SEND_MESSAGES"],
    Run: run
}