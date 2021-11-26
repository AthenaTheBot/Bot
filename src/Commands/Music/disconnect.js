const BaseCommand = require("../../Structures/Command");
const { getVoiceConnection } = require("@discordjs/voice");

class Command extends BaseCommand {
  constructor() {
    super({
      name: "disconnect",
      aliases: ["dc"],
      description: "",
      category: "Music",
      usage: null,
      options: [],
      cooldown: 2,
      required_perms: [],
      required_bot_perms: ["SEND_MESSAGES", "READ_MESSAGE_HISTORY"],
    });
  }

  async run(client, msg, args, locale) {
    client.songStates.delete(msg.guild.id);

    getVoiceConnection(msg.guild.id)?.destroy();

    msg.reply("👍");
  }
}

module.exports = Command;
