const BaseCommand = require('../../Structures/Command');

class Command extends BaseCommand {
    constructor(){
        super({
            name: 'ping',
            aliases: [],
            description: 'Simple command to check wheter bot is alive or not.',
            category: 'Misc',
            usage: null,
            options: [],
            cooldown: 2,
            required_perms: [],
            required_bot_perms: ["SEND_MESSAGES", "READ_MESSAGE_HISTORY"]
        });
    }

    async run(client, msg, args, locale){

        msg.reply(locale.MSG.replace('$ping', client.ws.ping));
        return;
    }
}

module.exports = Command;