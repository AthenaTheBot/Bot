const BaseCommand = require("../../Structures/Command");
const { getVoiceConnection, AudioPlayerStatus } = require("@discordjs/voice");

class Command extends BaseCommand {
  constructor() {
    super({
      name: "skip",
      aliases: ["s"],
      description: "Command for skipping song queue.",
      category: "Music",
      usage: null,
      options: [
        {
          type: "STRING",
          name: "number",
          description: "Number of songs to skip.",
          required: true,
        },
      ],
      cooldown: 2,
      required_perms: [],
      required_bot_perms: ["SEND_MESSAGES", "READ_MESSAGE_HISTORY"],
    });
  }

  async run(client, msg, args, locale) {
    const guildState = client.songStates.get(msg.guild.id);

    if (args[0] && isNaN(args[0])) return msg.reply(locale.INVALID_AMOUNT);

    guildState.playing = false;

    if (!args[0]) guildState.queue.shift();
    else {
      for (var i = 0; i < args[0]; i++) {
        guildState.queue.shift();
      }
    }

    if (guildState.queue.length == 0) {
      client.songStates.delete(msg.guild.id);
      getVoiceConnection(msg.guild.id)?.destroy();
      msg.reply("👍");
      return;
    }

    const playCommand = client.commands.get("play");

    playCommand.playSong(client, msg, guildState, true);

    msg.reply("👍");
  }
}

module.exports = Command;
