import CommandContext from "../Structures/CommandContext";
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
  (ctx: CommandContext): boolean => {
    ctx.respond(ctx.locales.PONG);

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
  (ctx: CommandContext): boolean => {
    const text = ctx.args.join(" ");

    if (!text) {
      ctx.respond(ctx.locales.WRONG_COMMAND_USAGE, true);
      return false;
    }

    if (text.length > 63) {
      ctx.respond(ctx.locales.TOO_BIG_TEXT, true);
      return false;
    }

    // TODO: Fix return bug.
    figlet(text, (err, result) => {
      if (err) {
        ctx.respond(ctx.locales.ERROR, true);
        return false;
      }

      ctx.respond("```\n" + result + "\n```");
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
  async (ctx: CommandContext): Promise<boolean> => {
    const targetUser = await ctx.parseUserFromArgs(0);

    if (!targetUser) {
      ctx.respond(ctx.locales.SPECIFY_USER, true);
      return false;
    }

    const Embed = new MessageEmbed()
      .setColor("#5865F2")
      .setTimestamp()
      .setTitle(
        ctx.locales.AVATAR_TITLE.replace("$user", targetUser.displayName)
      )
      .setImage(
        targetUser.displayAvatarURL({
          dynamic: true,
          size: 4096,
          format: "png",
        })
      );

    ctx.respond(Embed);

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
  async (ctx: CommandContext): Promise<boolean> => {
    ctx.respond(ctx.locales.INVITE_LINK, true);

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
  async (ctx: CommandContext): Promise<boolean> => {
    const Embed = new MessageEmbed()
      .setThumbnail(
        ctx.client.user?.displayAvatarURL({
          format: "png",
          size: 4096,
        }) as any
      )
      .setTitle(ctx.locales.HELP_TITLE)
      .setDescription(ctx.locales.HELP_BODY)
      .setColor("#5865F2");

    ctx.respond(Embed);
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
  async (ctx: CommandContext): Promise<boolean> => {
    const pollTime = ctx.args[0] as any;
    const question = ctx.args.slice(1).join(" ").trim();

    if (isNaN(pollTime) || !question) {
      ctx.respond(ctx.locales.WRONG_COMMAND_USAGE, true);
      return false;
    }

    const isPollSuccessfull = await ctx.client.pollManager.createPoll(
      ctx.channel.id,
      question,
      pollTime * 1000,
      ctx.locales
    );

    if (!isPollSuccessfull) {
      ctx.respond(ctx.locales.ERROR, true);
      return false;
    } else {
      ctx.respond("👍");
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
  async (ctx: CommandContext): Promise<boolean> => {
    if (!ctx.args[0]) {
      ctx.respond(ctx.locales.WRONG_COMMAND_USAGE), true;
      return false;
    }

    const poll = ctx.client.pollManager.getPoll(ctx.args[0]);

    if (!poll) {
      ctx.respond(ctx.locales.POLL_NOT_FOUND, true);
      return false;
    }

    const success = ctx.client.pollManager.endPoll(poll.id);

    if (success) {
      ctx.respond(ctx.locales.SUCCESS, true);
    } else {
      ctx.respond(ctx.locales.ERROR, true);

      return false;
    }

    return true;
  }
);
