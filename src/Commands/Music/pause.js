const BaseCommand = require("../../Structures/Command");

class Command extends BaseCommand {
  constructor() {
    super({
      name: "pause",
      aliases: [],
      description: "Command for pausing the song.",
      category: "Music",
      usage: null,
      options: [],
      cooldown: 2,
      required_perms: [],
      required_bot_perms: ["SEND_MESSAGES", "READ_MESSAGE_HISTORY"],
    });
  }

  async run(client, msg, args, locale) {
    const guildState = client.songStates.get(msg.guild.id);

    if (guildState?.player) {
      guildState?.player?.pause();
      msg.reply("👍");
    }
  }
}

module.exports = Command;
