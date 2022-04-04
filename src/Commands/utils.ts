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

export const pollCreate = new Command(
  "poll-create",
  [],
  "Create a poll",
  [
    {
      type: "NUMBER",
      name: "timeout",
      description: "Specify how much time should poll last (in seconds).",
      required: true,
    },
    {
      type: "STRING",
      name: "question",
      description: "Question to be asked",
      required: true,
    },
  ],
  5,
  [Permissions.MANAGE_GUILD],
  [
    Permissions.SEND_MESSAGES,
    Permissions.EMBED_LINKS,
    Permissions.ADD_REACTIONS,
  ],
  async (commandData: CommandData): Promise<boolean> => {
    const pollTime = commandData.args[0] as any;
    const question = commandData.args.slice(1).join(" ").trim();

    if (isNaN(pollTime) || !question) {
      commandData.respond(commandData.locales.WRONG_COMMAND_USAGE, true);
      return false;
    }

    const isPollSuccessfull = await commandData.client.pollManager.createPoll(
      commandData.channel.id,
      question,
      pollTime * 1000,
      commandData.locales
    );

    if (!isPollSuccessfull) {
      commandData.respond(commandData.locales.ERROR, true);
      return false;
    }

    return true;
  }
);

export const pollEnd = new Command(
  "poll-end",
  [],
  "Ends a poll",
  [
    {
      type: "STRING",
      name: "poll-id",
      description: "Specify the poll that you want to end.",
      required: true,
    },
  ],
  4,
  [Permissions.MANAGE_GUILD],
  [
    Permissions.SEND_MESSAGES,
    Permissions.EMBED_LINKS,
    Permissions.ADD_REACTIONS,
  ],
  async (commandData: CommandData): Promise<boolean> => {
    if (!commandData.args[0]) {
      commandData.respond(commandData.locales.WRONG_COMMAND_USAGE), true;
      return false;
    }

    const poll = commandData.client.pollManager.getPoll(commandData.args[0]);

    if (!poll) {
      commandData.respond(commandData.locales.POLL_NOT_FOUND, true);
      return false;
    }

    const success = commandData.client.pollManager.endPoll(poll.id);

    if (success) {
      commandData.respond(commandData.locales.SUCCESS, true);
    } else {
      commandData.respond(commandData.locales.ERROR, true);

      return false;
    }

    return true;
  }
);
