import CommandContext from "../Structures/CommandContext";
import {
  ApplicationCommandOptionType,
  AttachmentBuilder,
  EmbedBuilder,
} from "discord.js";
import { Permissions } from "../constants";
import canvacord from "canvacord";
import axios from "axios";
import Command from "../Structures/Command";

// TODO Commands: comment

export const cat = new Command(
  "cat",
  [],
  "Sends random cute cat images.",
  [],
  4,
  [],
  [Permissions.SendMessages, Permissions.AttachFiles],
  async (ctx: CommandContext): Promise<boolean> => {
    const data = await axios
      .get("https://api.thecatapi.com/v1/images/search")
      .then((res) => res?.data);

    if (!data) {
      ctx.respond(ctx.locales.ERROR, true);
      return false;
    }

    const attachment = new AttachmentBuilder(data[0].url, {
      name: "random_cat.png",
    });

    ctx.respond({ files: [attachment] });

    return true;
  }
);

export const dog = new Command(
  "dog",
  [],
  "Sends random cute dog images.",
  [],
  4,
  [],
  [Permissions.SendMessages, Permissions.AttachFiles],
  async (ctx: CommandContext): Promise<boolean> => {
    const data = await axios
      .get("https://dog.ceo/api/breeds/image/random")
      .then((res) => res?.data);

    if (!data) {
      ctx.respond(ctx.locales.ERROR, true);
      return false;
    }

    const attachment = new AttachmentBuilder(data.message, {
      name: "random_dog.png",
    });

    ctx.respond({ files: [attachment] });

    return true;
  }
);

export const coinflip = new Command(
  "coinflip",
  [],
  "Flip the coin see the result..",
  [],
  4,
  [],
  [Permissions.SendMessages],
  async (ctx: CommandContext): Promise<boolean> => {
    const result = Math.round(Math.random());

    if (result) {
      ctx.respond(ctx.locales.TAILS);
    } else {
      ctx.respond(ctx.locales.HEADS);
    }

    return true;
  }
);

export const worsethanhitler = new Command(
  "worsethanhitler",
  [],
  "Worse than hitler",
  [
    {
      type: ApplicationCommandOptionType.User,
      name: "user",
      description: "The user that you want to use in this meme.",
      required: true,
    },
  ],
  4,
  [],
  [Permissions.SendMessages, Permissions.EmbedLinks],
  async (ctx: CommandContext): Promise<boolean> => {
    const targetUser = await ctx.parseUserFromArgs(0);

    if (!targetUser) {
      ctx.respond(ctx.locales.SPECIFY_USER, true);
      return false;
    }

    const hitler = await canvacord.Canvacord.hitler(
      targetUser.displayAvatarURL({ extension: "png", forceStatic: false })
    );

    const attachment = new AttachmentBuilder(hitler, {
      name: "worseThanHitler.png",
    });

    ctx.respond({ files: [attachment] });

    return true;
  }
);

export const jail = new Command(
  "jail",
  [],
  "Put someone in jail.",
  [
    {
      type: ApplicationCommandOptionType.User,
      name: "User",
      description: "The user that you want to use in this meme.",
      required: true,
    },
  ],
  4,
  [],
  [Permissions.SendMessages, Permissions.EmbedLinks],
  async (ctx: CommandContext): Promise<boolean> => {
    const targetUser = await ctx.parseUserFromArgs(0);

    if (!targetUser) {
      ctx.respond(ctx.locales.SPECIFY_USER, true);
      return false;
    }

    const jail = await canvacord.Canvacord.jail(
      targetUser.displayAvatarURL({ extension: "png", forceStatic: false }),
      true
    );

    const attachment = new AttachmentBuilder(jail, { name: "jail.png" });

    ctx.respond({ files: [attachment] });

    return true;
  }
);

export const jokeoverhead = new Command(
  "jokeoverhead",
  [],
  "Don't just don't make jokes",
  [
    {
      type: ApplicationCommandOptionType.User,
      name: "user",
      description: "The user that you want to use in this meme.",
      required: true,
    },
  ],
  4,
  [],
  [Permissions.SendMessages, Permissions.EmbedLinks],
  async (ctx: CommandContext): Promise<boolean> => {
    const targetUser = await ctx.parseUserFromArgs(0);

    if (!targetUser) {
      ctx.respond(ctx.locales.SPECIFY_USER, true);
      return false;
    }

    const jokeOverHead = await canvacord.Canvacord.jokeOverHead(
      targetUser.displayAvatarURL({ extension: "png", forceStatic: false })
    );

    const attachment = new AttachmentBuilder(jokeOverHead, {
      name: "jokeOverHead.png",
    });

    ctx.respond({ files: [attachment] });

    return true;
  }
);

export const rip = new Command(
  "rip",
  [],
  "R.I.P",
  [
    {
      type: ApplicationCommandOptionType.User,
      name: "user",
      description: "The user that you want to use in this meme.",
      required: true,
    },
  ],
  4,
  [],
  [Permissions.SendMessages, Permissions.EmbedLinks],
  async (ctx: CommandContext): Promise<boolean> => {
    const targetUser = await ctx.parseUserFromArgs(0);

    if (!targetUser) {
      ctx.respond(ctx.locales.SPECIFY_USER, true);
      return false;
    }

    const rip = await canvacord.Canvacord.rip(
      targetUser.displayAvatarURL({ extension: "png", forceStatic: false })
    );

    const attachment = new AttachmentBuilder(rip, { name: "rip.png" });

    ctx.respond({ files: [attachment] });

    return true;
  }
);

export const trash = new Command(
  "trash",
  [],
  "Don't be a trash",
  [
    {
      type: ApplicationCommandOptionType.User,
      name: "user",
      description: "The user that you want to use in this meme.",
      required: true,
    },
  ],
  4,
  [],
  [Permissions.SendMessages, Permissions.EmbedLinks],
  async (ctx: CommandContext): Promise<boolean> => {
    const targetUser = await ctx.parseUserFromArgs(0);

    if (!targetUser) {
      ctx.respond(ctx.locales.SPECIFY_USER, true);
      return false;
    }

    const trash = await canvacord.Canvacord.trash(
      targetUser.displayAvatarURL({ extension: "png", forceStatic: false })
    );

    const attachment = new AttachmentBuilder(trash, { name: "trash.png" });

    ctx.respond({ files: [attachment] });

    return true;
  }
);

export const wanter = new Command(
  "wanted",
  [],
  "Try it but a sheriff may find you one time",
  [
    {
      type: ApplicationCommandOptionType.User,
      name: "user",
      description: "The user that you want to use in this meme.",
      required: true,
    },
  ],
  4,
  [],
  [Permissions.SendMessages, Permissions.EmbedLinks],
  async (ctx: CommandContext): Promise<boolean> => {
    const targetUser = await ctx.parseUserFromArgs(0);

    if (!targetUser) {
      ctx.respond(ctx.locales.SPECIFY_USER, true);
      return false;
    }

    const wanted = await canvacord.Canvacord.wanted(
      targetUser.displayAvatarURL({ extension: "png", forceStatic: false })
    );

    const attachment = new AttachmentBuilder(wanted, { name: "wanted.png" });

    ctx.respond({ files: [attachment] });

    return true;
  }
);
