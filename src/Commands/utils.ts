import { CommandData } from "../Modules/CommandManager";
import { Permissions } from "../constants";
import { MessageEmbed } from "discord.js";
import figlet from "figlet";
import Command from "../Structures/Command";

// TODO Commands: afk

export const ping = new Command(
  "ping",
  [],
  "Simple ping pong command whether to check bot is online or not.",
  [],
  1,
  [],
  [Permissions.SEND_MESSAGES],
  (commandData: CommandData): boolean => {
    commandData.respond(commandData.locales.PONG);

    return true;
  }
);

export const ascii = new Command(
  "ascii",
  [],
  "Sends the ascii format of the given text.",
  [
    {
      type: "STRING",
      name: "text",
      description: "A text to convert into ascii format",
      required: true,
    },
  ],
  3,
  [],
  [Permissions.SEND_MESSAGES, Permissions.EMBED_LINKS],
  (commandData: CommandData): boolean => {
    const text = commandData.args.join(" ");

    if (!text) {
      commandData.respond(commandData.locales.WRONG_COMMAND_USAGE, true);
      return false;
    }

    if (text.length > 63) {
      commandData.respond(commandData.locales.TOO_BIG_TEXT, true);
      return false;
    }

    // TODO: Fix return bug.
    figlet(text, (err, result) => {
      if (err) {
        commandData.respond(commandData.locales.ERROR, true);
        return false;
      }

      commandData.respond("```\n" + result + "\n```");
    });

    return true;
  }
);

export const avatar = new Command(
  "avatar",
  [],
  "Sends the avatar of the given user.",
  [
    {
      type: "USER",
      name: "user",
      description: "User to see avatar from.",
      required: true,
    },
  ],
  2,
  [],
  [Permissions.SEND_MESSAGES, Permissions.EMBED_LINKS],
  async (commandData: CommandData): Promise<boolean> => {
    const targetUser = await commandData.parseUserFromArgs(0);

    if (!targetUser) {
      commandData.respond(commandData.locales.SPECIFY_USER, true);
      return false;
    }

    const Embed = new MessageEmbed()
      .setColor("#5865F2")
      .setTimestamp()
      .setTitle(
        commandData.locales.AVATAR_TITLE.replace(
          "$user",
          commandData.author?.user.tag
        )
      )
      .setImage(
        targetUser.displayAvatarURL({
          dynamic: true,
          size: 4096,
          format: "png",
        })
      );

    commandData.respond(Embed);

    return true;
  }
);

export const invite = new Command(
  "invite",
  [],
  "Sends the invite link of Athena.",
  [],
  1,
  [],
  [Permissions.SEND_MESSAGES, Permissions.EMBED_LINKS],
  async (commandData: CommandData): Promise<boolean> => {
    commandData.respond(commandData.locales.INVITE_LINK, true);

    return true;
  }
);

// TODO: Better help command
export const help = new Command(
  "help",
  [],
  "Shows basic information about Athena great for the ones who don't know Athena.",
  [],
  1,
  [],
  [Permissions.SEND_MESSAGES, Permissions.EMBED_LINKS],
  async (commandData: CommandData): Promise<boolean> => {
    const Embed = new MessageEmbed()
      .setThumbnail(
        commandData.client.user?.displayAvatarURL({
          format: "png",
          size: 4096,
        }) as any
      )
      .setTitle(commandData.locales.HELP_TITLE)
      .setDescription(commandData.locales.HELP_BODY)
      .setColor("#5865F2");

    commandData.respond(Embed);
    return true;
  }
);
