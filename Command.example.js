const BaseCommand = require('../../Structures/Command');

class Command extends BaseCommand {
    constructor(){
        super({
            name: '',
            aliases: [],
            description: '',
            category: '',
            usage: null,
            options: [],
            cooldown: 2,
            required_perms: [],
            required_bot_perms: ["SEND_MESSAGES", "READ_MESSAGE_HISTORY"]
        });
    }

    async run(client, msg, args, locale) {}
}

module.exports = Command;