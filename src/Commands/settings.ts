import CommandContext from "../Structures/CommandContext";
import { Permissions } from "../constants";
import Command from "../Structures/Command";

export const prefix = new Command(
  "prefix",
  [],
  "Change the prefix of Athena for your server and use the best fit for your server!",
  [
    {
      type: "STRING",
      name: "prefix",
      description: "The prefix that you want to set",
      required: false,
    },
  ],
  5,
  [Permissions.ADMINISTRATOR],
  [Permissions.SEND_MESSAGES, Permissions.EMBED_LINKS],
  async (ctx: CommandContext): Promise<boolean> => {
    if (ctx.args.length === 0) {
      try {
        ctx.respond(
          ctx.locales.CURRENT_PREFIX.replace(
            "$prefix",
            ctx.db.guild.modules.settings.prefix
          ),
          true
        );
      } catch (err) {
        return false;
      }

      return true;
    } else {
      const success = await ctx.client.dbManager.updateDocument(
        "guilds",
        ctx.guild.id,
        { $set: { "modules.settings.prefix": ctx.args[0] } }
      );

      if (success) {
        ctx.respond(ctx.locales.SUCCESS, true);
      } else {
        ctx.respond(ctx.locales.ERROR, true);
      }
      return true;
    }
  }
);

export const language = new Command(
  "language",
  [],
  "Changes the language of Athena",
  [
    {
      type: "STRING",
      name: "language",
      description: "The langauge that you want to set",
      required: false,
    },
  ],
  5,
  [Permissions.ADMINISTRATOR],
  [Permissions.SEND_MESSAGES, Permissions.EMBED_LINKS],
  async (ctx: CommandContext): Promise<boolean> => {
    if (ctx.args.length === 0) {
      try {
        ctx.respond(
          ctx.locales.CURRENT_LANGUAGE.replace(
            "$language",
            ctx.db.guild.modules.settings.language
          ),
          true
        );
      } catch (err) {
        return false;
      }

      return true;
    } else {
      const availableLanguage = ctx.client.localeManager.getAvaiableLocales();

      if (!availableLanguage.includes(ctx.args[0])) {
        ctx.respond(
          ctx.locales.INVALID_LOCALE.replace(
            "$locales",
            availableLanguage.join(", ")
          ),
          true
        );
        return false;
      }

      const success = await ctx.client.dbManager.updateDocument(
        "guilds",
        ctx.guild.id,
        { $set: { "modules.settings.language": ctx.args[0] } }
      );

      if (success) {
        ctx.respond(ctx.locales.SUCCESS, true);
      } else {
        ctx.respond(ctx.locales.ERROR, true);
        return false;
      }

      return true;
    }
  }
);

export const adminrole = new Command(
  "adminrole",
  [],
  "Command for setting admin role.",
  [
    {
      type: "ROLE",
      name: "role",
      description: "The role that you want to set as bot admin.",
      required: true,
    },
  ],
  4,
  [Permissions.ADMINISTRATOR],
  [Permissions.SEND_MESSAGES, Permissions.EMBED_LINKS],
  async (ctx): Promise<boolean> => {
    const mentionedRole = await ctx.parseRoleFromArgs(0);

    if (!mentionedRole?.id) {
      ctx.respond(ctx.locales.SPECIFY_ROLE, true);
      return false;
    }

    const success = await ctx.client.guildManager.updateGuild(ctx.guild.id, {
      $set: { "modules.moderation.adminRole": mentionedRole.id },
    });

    if (success) {
      ctx.respond(ctx.locales.SUCCESS, true);
    } else {
      return ctx.respond(ctx.locales.ERROR, true);
    }

    return true;
  }
);

export const modrole = new Command(
  "modrole",
  [],
  "Command for setting mod role.",
  [
    {
      type: "ROLE",
      name: "role",
      description: "The role that you want to set as bot mod.",
      required: true,
    },
  ],
  4,
  [Permissions.ADMINISTRATOR],
  [Permissions.SEND_MESSAGES, Permissions.EMBED_LINKS],
  async (ctx: CommandContext): Promise<boolean> => {
    const mentionedRole = await ctx.parseRoleFromArgs(0);

    if (!mentionedRole?.id) {
      ctx.respond(ctx.locales.SPECIFY_ROLE, true);
      return false;
    }

    const success = await ctx.client.guildManager.updateGuild(ctx.guild.id, {
      $set: { "modules.moderation.modRole": mentionedRole.id },
    });

    if (success) {
      ctx.respond(ctx.locales.SUCCESS, true);
    } else {
      ctx.respond(ctx.locales.ERROR, true);
      return false;
    }

    return true;
  }
);
