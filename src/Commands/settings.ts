import { CommandData } from "../Modules/CommandManager";
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
  async (commandData: CommandData): Promise<boolean> => {
    if (commandData.args.length === 0) {
      try {
        commandData.respond(
          commandData.locales.CURRENT_PREFIX.replace(
            "$prefix",
            commandData.db.guild.modules.settings.prefix
          ),
          true
        );
      } catch (err) {
        return false;
      }

      return true;
    } else {
      const success = await commandData.client.dbManager.updateDocument(
        "guilds",
        commandData.guild.id,
        { $set: { "modules.settings.prefix": commandData.args[0] } }
      );

      if (success) {
        commandData.respond(commandData.locales.SUCCESS, true);
      } else {
        commandData.respond(commandData.locales.ERROR, true);
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
  async (commandData: CommandData): Promise<boolean> => {
    if (commandData.args.length === 0) {
      try {
        commandData.respond(
          commandData.locales.CURRENT_LANGUAGE.replace(
            "$language",
            commandData.db.guild.modules.settings.language
          ),
          true
        );
      } catch (err) {
        return false;
      }

      return true;
    } else {
      const availableLanguage =
        commandData.client.localeManager.getAvaiableLocales();

      if (!availableLanguage.includes(commandData.args[0])) {
        commandData.respond(
          commandData.locales.INVALID_LOCALE.replace(
            "$locales",
            availableLanguage.join(", ")
          ),
          true
        );
        return false;
      }

      const success = await commandData.client.dbManager.updateDocument(
        "guilds",
        commandData.guild.id,
        { $set: { "modules.settings.language": commandData.args[0] } }
      );

      if (success) {
        commandData.respond(commandData.locales.SUCCESS, true);
      } else {
        commandData.respond(commandData.locales.ERROR, true);
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
  async (commandData): Promise<boolean> => {
    const mentionedRole = await commandData.parseRoleFromArgs(0);

    if (!mentionedRole?.id) {
      commandData.respond(commandData.locales.SPECIFY_ROLE, true);
      return false;
    }

    const success = await commandData.client.guildManager.updateGuild(
      commandData.guild.id,
      {
        $set: { "modules.moderation.adminRole": mentionedRole.id },
      }
    );

    if (success) {
      commandData.respond(commandData.locales.SUCCESS, true);
    } else {
      return commandData.respond(commandData.locales.ERROR, true);
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
  async (commandData: CommandData): Promise<boolean> => {
    const mentionedRole = await commandData.parseRoleFromArgs(0);

    if (!mentionedRole?.id) {
      commandData.respond(commandData.locales.SPECIFY_ROLE, true);
      return false;
    }

    const success = await commandData.client.guildManager.updateGuild(
      commandData.guild.id,
      {
        $set: { "modules.moderation.modRole": mentionedRole.id },
      }
    );

    if (success) {
      commandData.respond(commandData.locales.SUCCESS, true);
    } else {
      commandData.respond(commandData.locales.ERROR, true);
      return false;
    }

    return true;
  }
);
