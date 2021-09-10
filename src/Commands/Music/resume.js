const BaseCommand = require('../../Structures/Command');

class Command extends BaseCommand {
    constructor(){
        super({
            name: 'resume',
            aliases: ['unpause', 'rs'],
            description: 'Command for resuming the song.',
            category: 'Music',
            usage: null,
            options: [],
            cooldown: 2,
            required_perms: [],
            required_bot_perms: ["SEND_MESSAGES", "READ_MESSAGE_HISTORY"]
        });
    }

    async run(client, msg, args, locale) {

        const guildState = client.songStates.get(msg.guild.id);

        guildState.player.unpause();

        msg.react('👍');
    }
}

module.exports = Command;