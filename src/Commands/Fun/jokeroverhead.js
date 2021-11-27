const BaseCommand = require("../../Structures/Command");
const { MessageAttachment } = require("discord.js");
const canvacord = require("canvacord");

class Command extends BaseCommand {
  constructor() {
    super({
      name: "jokeoverhead",
      aliases: [],
      description: "LOL what kind of joke is that",
      category: "Fun",
      usage: "@member",
      options: [
        {
          type: "USER",
          name: "user",
          description: "User",
          required: true,
        },
      ],
      cooldown: 2,
      required_perms: [],
      required_bot_perms: [
        "SEND_MESSAGES",
        "READ_MESSAGE_HISTORY",
        "ATTACH_FILES",
      ],
    });
  }

  async run(client, msg, args, locale) {
    let user;
    if (msg?.isInteraction) {
      user = (await msg.guild.members.fetch(args[0]))?.user || {};
      user.displayAvatarURL = ({ format, size, dynamic }) => {
        return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${format}?size=${size}`;
      };
    } else {
      user = msg.mentions.users.first() || msg.author;
    }
    const jokeOverHead = await canvacord.Canvas.jokeOverHead(
      user.displayAvatarURL({ format: "png", dynamic: false }),
      false
    );
    const attachment = new MessageAttachment(jokeOverHead, "jokeOverHead.png");

    return msg.reply({ files: [attachment] });
  }
}

module.exports = Command;
