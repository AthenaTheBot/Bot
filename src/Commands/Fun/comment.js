const BaseCommand = require("../../Structures/Command");
const { MessageEmbed, MessageAttachment } = require("discord.js");
const canvacord = require("canvacord");

class Command extends BaseCommand {
  constructor() {
    super({
      name: "comment",
      aliases: [],
      description: "Make a comment on a video that no one knows.",
      category: "Fun",
      usage: "[text]",
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
    const Embed = new MessageEmbed().setColor("#5865F2");
    const mention = msg.mentions.users.first();
    let user;
    if (msg?.isInteraction) {
      user = (await msg.guild.members.fetch(args[0]))?.user || {};
      user.displayAvatarURL = ({ format, size, dynamic }) => {
        return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${format}?size=${size}`;
      };
    } else {
      user = msg.mentions.users.first() || msg.author;
    }

    let str;
    if (!mention) str = args.slice(0).join(" ");
    else str = args.slice(1).join(" ");

    if (!str)
      return msg.reply({
        embeds: [Embed.setDescription(`${locale.INVALID_COMMENT}`)],
      });

    let mode;
    if (Math.floor(Math.random(0, 1) * 10)) mode = false;
    else mode = true;

    const comment = await canvacord.Canvas.youtube({
      username: user.username,
      content: str,
      avatar: user.displayAvatarURL({ format: "png", dynamic: false }),
      dark: mode,
    });
    const attachment = new MessageAttachment(comment, "wanted.png");

    return msg.reply({ files: [attachment] });
  }
}

module.exports = Command;
