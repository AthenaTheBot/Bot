import CommandContext from "../Structures/CommandContext";
import { TextChannel, ApplicationCommandOptionType } from "discord.js";
import { Permissions } from "../constants";
import UserWarning from "../Structures/UserWarning";
import Command from "../Structures/Command";

export const kick = new Command(
  "kick",
  [],
  "Kicks the specified user from guild.",
  [
    {
      type: ApplicationCommandOptionType.User,
      name: "user",
      description: "The user that you want to kick from the server.",
      required: true,
    },
  ],
  1,
  [Permissions.KickMembers],
  [Permissions.SendMessages, Permissions.EmbedLinks, Permissions.KickMembers],
  async (ctx: CommandContext): Promise<boolean> => {
    const targetUser = await ctx.parseUserFromArgs(0);

    if (!targetUser) {
      ctx.respond(ctx.locales.SPECIFY_USER, true);
      return false;
    }

    const authorRoleHiearchy = ctx.author?.roles?.highest?.rawPosition || 0;

    const targetRoleHiearchy = targetUser?.roles?.highest?.rawPosition || 0;

    const guildOwner = await ctx.guild.fetchOwner();

    if (
      targetRoleHiearchy >= authorRoleHiearchy &&
      guildOwner?.id !== ctx?.author?.id
    ) {
      ctx.respond(ctx.locales.USER_INSUFFICIENT_PERMS, true);
      return false;
    }

    if (!targetUser.kickable) {
      ctx.respond(ctx.locales.BOT_INSUFFICIENT_PERMS, true);
      return false;
    }

    try {
      targetUser.kick(
        ctx.locales.ACTION_DONE_BY.replace("$user", ctx.author?.id)
      );
    } catch (err) {
      ctx.respond(ctx.locales.ERROR, true);
      ctx.client.errorHandler.recordError(err as Error);
      return false;
    }

    ctx.respond(ctx.locales.SUCCESS, true);

    return true;
  }
);

export const ban = new Command(
  "ban",
  [],
  "Bans the specified user from guild.",
  [
    {
      type: ApplicationCommandOptionType.User,
      name: "user",
      description: "The user that you want to ban from the server.",
      required: true,
    },
  ],
  1,
  [Permissions.BanMembers],
  [Permissions.SendMessages, Permissions.EmbedLinks, Permissions.BanMembers],
  async (ctx: CommandContext): Promise<boolean> => {
    const targetUser = await ctx.parseUserFromArgs(0);

    if (!targetUser) {
      ctx.respond(ctx.locales.SPECIFY_USER, true);
      return false;
    }

    const authorRoleHiearchy = ctx.author?.roles?.highest?.rawPosition || 0;

    const targetRoleHiearchy = targetUser?.roles?.highest?.rawPosition || 0;

    const guildOwner = await ctx.guild.fetchOwner();

    if (
      targetRoleHiearchy >= authorRoleHiearchy &&
      guildOwner?.id !== ctx?.author?.id
    ) {
      ctx.respond(ctx.locales.USER_INSUFFICIENT_PERMS, true);
      return false;
    }

    if (!targetUser.bannable) {
      ctx.respond(ctx.locales.BOT_INSUFFICIENT_PERMS, true);
      return false;
    }

    try {
      targetUser.ban({
        reason: ctx.locales.ACTION_DONE_BY.replace("$user", ctx.author?.id),
      });
    } catch (err) {
      ctx.respond(ctx.locales.ERROR, true);
      ctx.client.errorHandler.recordError(err as Error);
      return false;
    }

    ctx.respond(ctx.locales.SUCCESS, true);

    return true;
  }
);

export const slowmode = new Command(
  "slowmode",
  [],
  "Manages the slowmodes in text channels.",
  [
    {
      type: ApplicationCommandOptionType.String,
      name: "timeout",
      description: "Timeout duration for this text channel (ex: 10s).",
      required: true,
    },
  ],
  1,
  [Permissions.ManageChannels],
  [
    Permissions.SendMessages,
    Permissions.EmbedLinks,
    Permissions.ManageChannels,
  ],
  async (ctx: CommandContext): Promise<boolean> => {
    const keywords = [
      {
        key: "s",
        value: 1,
      },
      {
        key: "m",
        value: 60,
      },
      {
        key: "h",
        value: 60 * 60,
      },
    ];

    if (!ctx.args[0]) {
      ctx.respond(ctx.locales.WRONG_COMMAND_USAGE, true);
      return false;
    }

    let timeout: string = ctx.args[0];

    if (!isNaN(timeout as any)) timeout = timeout + "s";
    if (timeout === "off") timeout = "_0_";

    // Putting ; between keywords
    keywords.forEach((item) => {
      timeout = timeout.replaceAll(item.key, item.key + ";");
    });

    // Splitting ;
    let table = timeout.split(";").filter((x) => x !== "");
    let processedValues: any[] = [];

    // Processing keywords
    table.forEach((t) => {
      let keyword: any;
      // Finding item
      keywords.forEach((x) => {
        if (t.includes(x.key)) keyword = x;
      });

      const updated = t.split(keyword?.key).filter((x) => x !== "")[0] as any;
      const val = updated * keyword?.value;

      if (isNaN(val) && updated === "_0_") return processedValues.push(0);
      if (!isNaN(val) && val > 0) return processedValues.push(val);
      else processedValues.push(undefined);
    });

    let resultVal = 0;
    for (var i = 0; i < processedValues.length; i++) {
      if (!isNaN(processedValues[i] as any)) {
        resultVal += processedValues[i];
      } else {
        resultVal = -1;
        break;
      }
    }

    if (resultVal == -1) {
      ctx.respond(ctx.locales.WRONG_COMMAND_USAGE, true);
      return false;
    }

    // TODO: Warn users instead of assiging max value
    if (resultVal >= 21600) resultVal = 21600;

    try {
      (ctx.channel as TextChannel).setRateLimitPerUser(resultVal);
    } catch (err) {
      ctx.respond(ctx.locales.ERROR, false);
      return false;
    }

    ctx.respond(ctx.locales.SUCCESS, true);

    return true;
  }
);

export const clear = new Command(
  "clear",
  ["purge"],
  "Clears the specified amount of message in the text channel.",
  [
    {
      type: ApplicationCommandOptionType.Number,
      name: "amount",
      description: "Amount of messages to delete in this text channel.",
      required: true,
    },
  ],
  1,
  [Permissions.ManageMessages],
  [
    Permissions.SendMessages,
    Permissions.EmbedLinks,
    Permissions.ManageMessages,
  ],
  async (ctx: CommandContext): Promise<boolean> => {
    if (!ctx.args[0] || isNaN(parseInt(ctx.args[0])) || ctx.args[0] == "0") {
      ctx.respond(ctx.locales.WRONG_COMMAND_USAGE, true);
      return false;
    }

    let messageAmount = parseInt(ctx.args[0]);
    const actions = [];

    while (true) {
      if (messageAmount <= 100) {
        actions.push(messageAmount);
        break;
      } else {
        actions.push(100);
        messageAmount -= 100;
      }
    }

    for (var i = 0; i < actions.length; i++) {
      try {
        (ctx.channel as TextChannel).bulkDelete(actions[i], true);

        actions.shift();
      } catch (err) {
        ctx.respond(ctx.locales.ERROR, false);
        break;
      }
    }

    ctx.respond(ctx.locales.SUCCESS, true);

    return true;
  }
);

export const warn = new Command(
  "warn",
  [],
  "Warns mentioned user.",
  [
    {
      type: ApplicationCommandOptionType.User,
      name: "user",
      description: "The user that you want to warn.",
      required: true,
    },
  ],
  1,
  [Permissions.KickMembers, Permissions.BanMembers],
  [
    Permissions.SendMessages,
    Permissions.EmbedLinks,
    Permissions.KickMembers,
    Permissions.BanMembers,
  ],
  async (ctx: CommandContext): Promise<boolean> => {
    const targetUser = await ctx.parseUserFromArgs(0);

    if (!targetUser) {
      ctx.respond(ctx.locales.SPECIFY_USER, true);
      return false;
    }

    const authorRoleHiearchy = ctx.author?.roles?.highest?.rawPosition || 0;

    const targetRoleHiearchy = targetUser?.roles?.highest?.rawPosition || 0;

    const guildOwner = await ctx.guild.fetchOwner();

    if (
      targetRoleHiearchy >= authorRoleHiearchy &&
      guildOwner?.id !== ctx?.author?.id
    ) {
      ctx.respond(ctx.locales.USER_INSUFFICIENT_PERMS, true);
      return false;
    }

    if (!targetUser.kickable && !targetUser.bannable) {
      ctx.respond(ctx.locales.BOT_INSUFFICIENT_PERMS, true);
      return false;
    }

    let reason =
      ctx.args.slice(1).join(" ") || ctx.locales.REASON_NOT_SPECIFIED;

    let userWarn = ctx.db.guild.modules.moderation?.warnings?.find(
      (x) => x.id == targetUser.id
    );

    if (userWarn) {
      userWarn.warnings.push(reason);
    } else {
      userWarn = new UserWarning(targetUser.id);
      userWarn.warnings.push(reason);
      ctx.db.guild.modules.moderation?.warnings?.push(userWarn);
    }

    ctx.client.guildManager.updateGuild(ctx.guild.id, {
      $set: {
        "modules.moderation.warnings":
          ctx.db.guild.modules.moderation?.warnings,
      },
    });

    if (userWarn.warnings.length == ctx.client.config.actions.warnKickCount) {
      targetUser.kick(
        "User has been warned for " +
          ctx.client.config.actions.warnKickCount +
          " times."
      );
      ctx.respond(
        ctx.locales.WARN_KICKED_USER.replace(
          "$user",
          targetUser.user.username,
          true
        ).replace("$times", ctx.client.config.actions.warnKickCount),
        true
      );

      return true;
    } else if (
      userWarn.warnings.length == ctx.client.config.actions.warnBanCount
    ) {
      targetUser.ban({
        reason:
          "User has been warned for " +
          ctx.client.config.actions.warnBanCount +
          " times.",
      });

      ctx.respond(
        ctx.locales.WARN_BANNED_USER.replace(
          "$user",
          targetUser.user.username
        ).replace("$times", ctx.client.config.actions.warnBanCount),
        true
      );

      ctx.client.guildManager.updateGuild(ctx.guild.id, {
        $pull: {
          "modules.moderation.warnings": { id: targetUser.id },
        },
      });

      return true;
    }

    ctx.respond(
      ctx.locales.WARNED_USER.replace("$user", targetUser.user.username)
        .replace("$reason", userWarn.warnings[userWarn.warnings.length - 1])
        .replace("$warn_count", userWarn.warnings.length),
      true
    );

    return true;
  }
);

export const reswarn = new Command(
  "reswarn",
  ["resetwarn", "resetwarning"],
  "Resets the warnings of that user.",
  [
    {
      type: ApplicationCommandOptionType.User,
      name: "user",
      description: "User to reset the warnigs",
      required: true,
    },
  ],
  1,
  [Permissions.KickMembers, Permissions.BanMembers],
  [Permissions.SendMessages, Permissions.EmbedLinks],
  async (ctx: CommandContext): Promise<boolean> => {
    const targetUser = await ctx.parseUserFromArgs(0);

    if (!targetUser) {
      ctx.respond(ctx.locales.SPECIFY_USER, true);
      return false;
    }

    const authorRoleHiearchy = ctx.author?.roles?.highest?.rawPosition || 0;

    const targetRoleHiearchy = targetUser?.roles?.highest?.rawPosition || 0;

    const guildOwner = await ctx.guild.fetchOwner();

    if (
      targetRoleHiearchy >= authorRoleHiearchy &&
      guildOwner?.id !== ctx?.author?.id
    ) {
      ctx.respond(ctx.locales.USER_INSUFFICIENT_PERMS, true);
      return false;
    }

    const userWarning = ctx.db.guild.modules.moderation?.warnings?.find(
      (x) => x.id == targetUser.id
    );

    if (userWarning) {
      userWarning.warnings = [];
      ctx.client.guildManager.updateGuild(ctx.guild.id, {
        $set: {
          "modules.moderation.warnings":
            ctx.db.guild.modules.moderation?.warnings,
        },
      });
    }

    ctx.respond(ctx.locales.SUCCESS, true);

    return true;
  }
);

export const autorole = new Command(
  "autorole",
  ["auto-role"],
  "Sets auto role.",
  [
    {
      type: ApplicationCommandOptionType.Role,
      name: "role",
      description: "Role you want to set as auto role.",
      required: true,
    },
  ],
  1,
  [Permissions.ManageGuild, Permissions.ManageRoles],
  [Permissions.SendMessages, Permissions.EmbedLinks, Permissions.ManageRoles],
  async (ctx: CommandContext): Promise<boolean> => {
    const targetRole = await ctx.parseRoleFromArgs(0);
    const highestUserRole = ctx.author?.roles.highest;
    const highestBotRole = ctx.guild.members.me?.roles.highest;

    if (!targetRole) {
      ctx.respond(ctx.locales.WRONG_COMMAND_USAGE, true);

      return false;
    }

    if (
      targetRole?.rawPosition >= (highestUserRole?.rawPosition || 0) &&
      ctx.guild.ownerId !== ctx?.author?.id
    ) {
      ctx.respond(ctx.locales.USER_INSUFFICIENT_PERMS, true);

      return false;
    }

    if (targetRole?.rawPosition >= (highestBotRole?.rawPosition || 0)) {
      ctx.respond(ctx.locales.BOT_INSUFFICIENT_PERMS, true);

      return false;
    }

    if (ctx.db.guild.modules.moderation.autoRole === targetRole?.id) {
      ctx.respond(ctx.locales.UPDATE_NOT_NEEDED, true);

      return false;
    }

    if (targetRole.managed) {
      ctx.respond(ctx.locales.ROLE_MANAGED, true);

      return false;
    }

    const updateSuccess = await ctx.client.dbManager.updateDocument(
      "guilds",
      ctx.guild.id,
      {
        $set: { "modules.moderation.autoRole": targetRole?.id },
      }
    );

    if (!updateSuccess) {
      ctx.respond(ctx.locales.ERROR, true);

      return false;
    }

    ctx.respond(ctx.locales.SUCCESS, true);

    return true;
  }
);
