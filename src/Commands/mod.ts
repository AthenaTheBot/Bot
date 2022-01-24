import { TextChannel } from "discord.js";
import { CommandManager, CommandData } from "../Classes/CommandManager";
import { Permissions } from "../Classes/PermissionResolver";
import UserWarning from "../Classes/UserWarning";

// TODO Commands:  warn, delwarn, setwarn?

export default (commandManager: CommandManager) => {
  commandManager.registerCommand(
    "kick",
    [],
    "Kicks the specified user from guild.",
    [
      {
        type: "USER",
        name: "User",
        description: "The user that you want to kick from the server.",
        required: true,
      },
    ],
    1,
    [Permissions.KICK_MEMBERS],
    [
      Permissions.SEND_MESSAGES,
      Permissions.EMBED_LINKS,
      Permissions.KICK_MEMBERS,
    ],
    async (commandData: CommandData): Promise<boolean> => {
      const targetUser = await commandData.parseUserFromArgs(0);

      if (!targetUser) {
        commandData.respond(commandData.locales.SPECIFY_USER, true);
        return false;
      }

      const authorRoleHiearchy =
        commandData.author?.roles?.highest?.rawPosition || 0;

      const targetRoleHiearchy = targetUser?.roles?.highest?.rawPosition || 0;

      const guildOwner = await commandData.guild.fetchOwner();

      if (
        targetRoleHiearchy >= authorRoleHiearchy &&
        guildOwner?.id !== commandData?.author?.id
      ) {
        commandData.respond(commandData.locales.USER_INSUFFICIENT_PERMS, true);
        return false;
      }

      if (!targetUser.kickable) {
        commandData.respond(commandData.locales.BOT_INSUFFICIENT_PERMS, true);
        return false;
      }

      try {
        targetUser.kick(
          commandData.locales.ACTION_DONE_BY.replace(
            "$user",
            commandData.author?.id
          )
        );
      } catch (err) {
        commandData.respond(commandData.locales.ERROR, true);
        commandData.client.errorHandler.recordError(err as Error);
        return false;
      }

      commandData.respond(commandData.locales.SUCCESS, true);

      return true;
    }
  );

  commandManager.registerCommand(
    "ban",
    [],
    "Bans the specified user from guild.",
    [
      {
        type: "USER",
        name: "User",
        description: "The user that you want to ban from the server.",
        required: true,
      },
    ],
    1,
    [Permissions.BAN_MEMBERS],
    [
      Permissions.SEND_MESSAGES,
      Permissions.EMBED_LINKS,
      Permissions.BAN_MEMBERS,
    ],
    async (commandData: CommandData): Promise<boolean> => {
      const targetUser = await commandData.parseUserFromArgs(0);

      if (!targetUser) {
        commandData.respond(commandData.locales.SPECIFY_USER, true);
        return false;
      }

      const authorRoleHiearchy =
        commandData.author?.roles?.highest?.rawPosition || 0;

      const targetRoleHiearchy = targetUser?.roles?.highest?.rawPosition || 0;

      const guildOwner = await commandData.guild.fetchOwner();

      if (
        targetRoleHiearchy >= authorRoleHiearchy &&
        guildOwner?.id !== commandData?.author?.id
      ) {
        commandData.respond(commandData.locales.USER_INSUFFICIENT_PERMS, true);
        return false;
      }

      if (!targetUser.bannable) {
        commandData.respond(commandData.locales.BOT_INSUFFICIENT_PERMS, true);
        return false;
      }

      try {
        targetUser.ban({
          reason: commandData.locales.ACTION_DONE_BY.replace(
            "$user",
            commandData.author?.id
          ),
        });
      } catch (err) {
        commandData.respond(commandData.locales.ERROR, true);
        commandData.client.errorHandler.recordError(err as Error);
        return false;
      }

      commandData.respond(commandData.locales.SUCCESS, true);

      return true;
    }
  );

  commandManager.registerCommand(
    "slowmode",
    [],
    "Manages the slowmodes in text channels.",
    [
      {
        type: "STRING",
        name: "Timeout",
        description: "Timeout duration for this text channel (ex: 10s).",
        required: true,
      },
    ],
    1,
    [Permissions.MANAGE_CHANNELS],
    [
      Permissions.SEND_MESSAGES,
      Permissions.EMBED_LINKS,
      Permissions.MANAGE_CHANNELS,
    ],
    async (commandData: CommandData): Promise<boolean> => {
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

      if (!commandData.args[0]) {
        commandData.respond(commandData.locales.WRONG_COMMAND_USAGE, true);
        return false;
      }

      let timeout: string = commandData.args[0];

      if (!isNaN(parseInt(timeout))) timeout = timeout + "s";
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
        commandData.respond(commandData.locales.WRONG_COMMAND_USAGE, true);
        return false;
      }

      // TODO: Warn users instead of assiging max value
      if (resultVal >= 21600) resultVal = 21600;

      try {
        (commandData.channel as TextChannel).setRateLimitPerUser(resultVal);
      } catch (err) {
        commandData.respond(commandData.locales.ERROR, false);
        return false;
      }

      commandData.respond(commandData.locales.SUCCESS, true);

      return true;
    }
  );

  commandManager.registerCommand(
    "clear",
    ["purge"],
    "Clears the specified amount of message in the text channel.",
    [
      {
        type: "NUMBER",
        name: "Amount",
        description: "Amount of messages to delete in this text channel.",
        required: true,
      },
    ],
    1,
    [Permissions.MANAGE_MESSAGES],
    [
      Permissions.SEND_MESSAGES,
      Permissions.EMBED_LINKS,
      Permissions.MANAGE_MESSAGES,
    ],
    async (commandData: CommandData): Promise<boolean> => {
      if (
        !commandData.args[0] ||
        isNaN(parseInt(commandData.args[0])) ||
        commandData.args[0] == "0"
      ) {
        commandData.respond(commandData.locales.WRONG_COMMAND_USAGE, true);
        return false;
      }

      let messageAmount = parseInt(commandData.args[0]);
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
          (commandData.channel as TextChannel).bulkDelete(actions[i], true);

          actions.shift();
        } catch (err) {
          commandData.respond(commandData.locales.ERROR, false);
          break;
        }
      }

      commandData.respond(commandData.locales.SUCCESS, true);

      return true;
    }
  );

  commandManager.registerCommand(
    "warn",
    [],
    "Warns mentioned user.",
    [
      {
        type: "USER",
        name: "User",
        description: "The user that you want to warn.",
        required: true,
      },
    ],
    1,
    [Permissions.KICK_MEMBERS, Permissions.BAN_MEMBERS],
    [
      Permissions.SEND_MESSAGES,
      Permissions.EMBED_LINKS,
      Permissions.KICK_MEMBERS,
      Permissions.BAN_MEMBERS,
    ],
    async (commandData: CommandData): Promise<boolean> => {
      const targetUser = await commandData.parseUserFromArgs(0);

      if (!targetUser) {
        commandData.respond(commandData.locales.SPECIFY_USER, true);
        return false;
      }

      const authorRoleHiearchy =
        commandData.author?.roles?.highest?.rawPosition || 0;

      const targetRoleHiearchy = targetUser?.roles?.highest?.rawPosition || 0;

      const guildOwner = await commandData.guild.fetchOwner();

      if (
        targetRoleHiearchy >= authorRoleHiearchy &&
        guildOwner?.id !== commandData?.author?.id
      ) {
        commandData.respond(commandData.locales.USER_INSUFFICIENT_PERMS, true);
        return false;
      }

      if (!targetUser.kickable && !targetUser.bannable) {
        commandData.respond(commandData.locales.BOT_INSUFFICIENT_PERMS, true);
        return false;
      }

      let reason =
        commandData.args.slice(1).join(" ") ||
        commandData.locales.REASON_NOT_SPECIFIED;

      let userWarn =
        commandData.db.guild.modules.moderationModule?.warnings?.find(
          (x) => x.id == targetUser.id
        );

      if (userWarn) {
        userWarn.warnings.push(reason);
      } else {
        userWarn = new UserWarning(targetUser.id);
        userWarn.warnings.push(reason);
        commandData.db.guild.modules.moderationModule?.warnings?.push(userWarn);
      }

      commandData.client.guildManager.updateGuild(commandData.guild.id, {
        $set: {
          "modules.moderationModule.warnings":
            commandData.db.guild.modules.moderationModule?.warnings,
        },
      });

      if (
        userWarn.warnings.length ==
        commandData.client.config.actions.warnKickCount
      ) {
        targetUser.kick(
          "User has been warned for " +
            commandData.client.config.actions.warnKickCount +
            " times."
        );
        commandData.respond(
          commandData.locales.WARN_KICKED_USER.replace(
            "$user",
            targetUser.user.username,
            true
          ).replace("$times", commandData.client.config.actions.warnKickCount),
          true
        );

        return true;
      } else if (
        userWarn.warnings.length ==
        commandData.client.config.actions.warnBanCount
      ) {
        targetUser.ban({
          reason:
            "User has been warned for " +
            commandData.client.config.actions.warnBanCount +
            " times.",
        });

        commandData.respond(
          commandData.locales.WARN_BANNED_USER.replace(
            "$user",
            targetUser.user.username
          ).replace("$times", commandData.client.config.actions.warnBanCount),
          true
        );

        commandData.client.guildManager.updateGuild(commandData.guild.id, {
          $pull: {
            "modules.moderationModule.warnings": { id: targetUser.id },
          },
        });

        return true;
      }

      commandData.respond(
        commandData.locales.WARNED_USER.replace(
          "$user",
          targetUser.user.username
        )
          .replace("$reason", userWarn.warnings[userWarn.warnings.length - 1])
          .replace("$warn_count", userWarn.warnings.length),
        true
      );

      return true;
    }
  );

  commandManager.registerCommand(
    "reswarn",
    ["resetwarn", "resetwarning"],
    "Resets the warnings of that user.",
    [
      {
        type: "USER",
        name: "User",
        description: "User",
        required: true,
      },
    ],
    1,
    [Permissions.KICK_MEMBERS, Permissions.BAN_MEMBERS],
    [Permissions.SEND_MESSAGES, Permissions.EMBED_LINKS],
    async (commandData: CommandData): Promise<boolean> => {
      const targetUser = await commandData.parseUserFromArgs(0);

      if (!targetUser) {
        commandData.respond(commandData.locales.SPECIFY_USER, true);
        return false;
      }

      const authorRoleHiearchy =
        commandData.author?.roles?.highest?.rawPosition || 0;

      const targetRoleHiearchy = targetUser?.roles?.highest?.rawPosition || 0;

      const guildOwner = await commandData.guild.fetchOwner();

      if (
        targetRoleHiearchy >= authorRoleHiearchy &&
        guildOwner?.id !== commandData?.author?.id
      ) {
        commandData.respond(commandData.locales.USER_INSUFFICIENT_PERMS, true);
        return false;
      }

      const userWarning =
        commandData.db.guild.modules.moderationModule?.warnings?.find(
          (x) => x.id == targetUser.id
        );

      if (userWarning) {
        userWarning.warnings = [];
        commandData.client.guildManager.updateGuild(commandData.guild.id, {
          $set: {
            "modules.moderationModule.warnings":
              commandData.db.guild.modules.moderationModule?.warnings,
          },
        });
      }

      commandData.respond(commandData.locales.SUCCESS, true);

      return true;
    }
  );
};
