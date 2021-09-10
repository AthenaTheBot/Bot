const BaseCommand = require('../../Structures/Command');
const {
    joinVoiceChannel,
} = require('@discordjs/voice');

class Command extends BaseCommand {
    constructor(){
        super({
            name: 'join',
            aliases: ["j"],
            description: '',
            category: 'Music',
            usage: null,
            options: [],
            cooldown: 2,
            required_perms: [],
            required_bot_perms: ["SEND_MESSAGES", "READ_MESSAGE_HISTORY", "CONNECT", "SPEAK"]
        });
    }

    async run(client, msg, args, locale) {
        await joinVoiceChannel({ 
            channelId: msg.member.voice.channel.id, 
            guildId: msg.guild.id, 
            selfDeaf: true, 
            selfMute: false, 
            adapterCreator: msg.guild.voiceAdapterCreator 
        });

        msg.react('👍');
    }
}

module.exports = Command;