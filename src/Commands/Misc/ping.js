const run = async (client, message, args, locale) => {

    locale = JSON.parse(JSON.stringify(locale).replace('$ping', client.ws.ping));

    message.channel.send(locale.MSG);
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