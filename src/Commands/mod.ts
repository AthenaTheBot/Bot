import { TextChannel } from "discord.js";
import { CommandManager, CommandData } from "../Classes/CommandManager";
import { Permissions } from "../Classes/PermissionResolver";

// TODO Commands: clear, slowmode, warn, delwarn, setwarn?

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
    4,
    [Permissions.KICK_MEMBERS],
    [
      Permissions.SEND_MESSAGES,
      Permissions.EMBED_LINKS,
      Permissions.KICK_MEMBERS,
    ],
    async (commandData: CommandData): Promise<boolean> => {
      let targetUser;

      if (commandData.type === "Interaction") {
        targetUser =
          (await commandData.guild.members.cache.get(commandData.args[0])) ||
          null;
      } else {
        targetUser =
          commandData.raw.mentions.members.first()?.id || commandData.args[0];

        if (targetUser)
          targetUser =
            (await commandData.guild.members.cache.get(targetUser)) || null;
      }

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
    4,
    [Permissions.BAN_MEMBERS],
    [
      Permissions.SEND_MESSAGES,
      Permissions.EMBED_LINKS,
      Permissions.BAN_MEMBERS,
    ],
    async (commandData: CommandData): Promise<boolean> => {
      let targetUser;

      if (commandData.type === "Interaction") {
        targetUser =
          (await commandData.guild.members.cache.get(commandData.args[0])) ||
          null;
      } else {
        targetUser =
          commandData.raw.mentions.members.first()?.id || commandData.args[0];

        if (targetUser)
          targetUser =
            (await commandData.guild.members.cache.get(targetUser)) || null;
      }

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
        description: "Timeout duration for this channel (ex: 10s).",
        required: true,
      },
    ],
    4,
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
        else processedValues.push(null);
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

      // TODO:
      if (resultVal >= 21600) return false;

      try {
        (commandData.channel as TextChannel).setRateLimitPerUser(resultVal);
      } catch (err) {
        commandData.respond(commandData.locales.ERROR, false);
      }

      commandData.respond(commandData.locales.SUCCESS, true);

      return true;
    }
  );
};
