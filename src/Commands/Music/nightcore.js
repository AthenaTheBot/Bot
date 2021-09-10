const BaseCommand = require('../../Structures/Command');

class Command extends BaseCommand {
    constructor(){
        super({
            name: 'nightcore',
            aliases: [],
            description: 'Command for applying nightcore effect to your song.',
            category: 'Music',
            usage: null,
            options: [],
            cooldown: 2,
            required_perms: [],
            required_bot_perms: ["SEND_MESSAGES", "READ_MESSAGE_HISTORY"]
        });
    }

    async run(client, msg, args, locale) {

        const nightCoreEffect = "aresample=48000,asetrate=48000*1.25";

        const guildState = client.songStates.get(msg.guild.id);

        if (guildState.encoderArgs.includes(nightCoreEffect)) {

            guildState.encoderArgs = guildState.encoderArgs.filter(x => x != nightCoreEffect);
        }
        else {

            guildState.encoderArgs.push(nightCoreEffect);
        }

        guildState.playing = false;

        const errorMSG = client.locales.get(locale.language).locales.find(locale => locale.cmd == 'play').content["ERROR"];

        const playCommand = client.commands.get('play');
        playCommand.playSong(guildState, (startedPlaying) => {
            if (!startedPlaying) return msg.reply(errorMSG);
            else {

                msg.react('👍');
            }
        });

    }
}

module.exports = Command;