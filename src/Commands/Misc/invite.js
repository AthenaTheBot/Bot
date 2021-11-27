const BaseCommand = require("../../Structures/Command");
const { MessageEmbed } = require("discord.js");

class Command extends BaseCommand {
  constructor() {
    super({
      name: "invite",
      aliases: [],
      description: "Sens the invite link of Athena.",
      category: "Misc",
      usage: null,
      options: [],
      cooldown: 2,
      required_perms: [],
      required_bot_perms: ["SEND_MESSAGES", "READ_MESSAGE_HISTORY"],
    });
  }

  async run(client, msg, args, locale) {
    const Embed = new MessageEmbed().setColor("#5865F2");

    Embed.setDescription(
      locale.MSG.replace("$url", "https://athena.bot/invite")
    );

    return msg.reply(Embed).catch((err) => {});
  }
}

module.exports = Command;
