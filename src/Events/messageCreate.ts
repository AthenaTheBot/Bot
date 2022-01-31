import Event from "../Classes/Event";
import { CommandData, CommandDataTypes } from "../Classes/CommandData";
import { Permissions } from "../Classes/PermissionResolver";

export default new Event(
  "messageCreate",
  async (client, msgData): Promise<boolean> => {
    if (msgData.author.bot || !msgData.guild) return false;

    // Fetch user and guilld data with a force arguement passed.
    const guild = await client.guildManager.fetch(msgData.guild.id, true);
    const user = await client.userManager.fetch(msgData.author.id, true);

    // If still guild and user data are not proper then do nothing.
    if (!guild || !user) return false;

    // Check if message starts with server prefix
    if (!msgData.content.trim().startsWith(guild?.settings?.prefix))
      return false;

    // Parse command name from the message content
    const commandName = msgData.content
      .trim()
      .split(" ")[0]
      .split(guild.settings.prefix)
      .pop()
      .toLowerCase();

    // Check wheter the comamnd is valid or not
    if (!client.commandManager.isValidCommand(commandName)) return false;

    // Get the command data through command manager
    const command = client.commandManager.getCommand(commandName);

    // If command is not valid do not execute the command
    if (!command) return false;

    // Command data
    const commandData = new CommandData(command, client, {
      type: CommandDataTypes.Message,
      data: msgData,
      db: { user: user, guild: guild },
    });

    // Check if user is in cooldown
    const isInCooldown = client.cooldownManager.isInCooldown(
      msgData.author.id,
      command.name
    );

    if (isInCooldown) {
      const isWarnSent = client.cooldownManager.isWarnSent(
        msgData.author.id,
        command.name
      );
      if (
        !isWarnSent &&
        !commandData.executeFail?.perms?.includes(Permissions.SEND_MESSAGES)
      ) {
        commandData.respond(commandData.locales.COOLDOWN_WARNING);
        client.cooldownManager.updateWarnSent(
          msgData.author.id,
          command.name,
          true
        );
      }
      return false;
    }

    if (!commandData.executeable) {
      if (commandData.executeFail) console.log(commandData.executeFail.perms);
      if (commandData.executeFail?.reason == "USER_INSUFFICIENT_PERMS") {
        commandData.respond(commandData.locales.USER_INSUFFICIENT_PERMS, false);
      }
      return false;
    }

    // Execute command
    command?.exec(commandData);

    // Add cooldown to user
    client.cooldownManager.addCooldown(
      msgData.author.id,
      command.name,
      command.cooldown
    );

    // If debug mode is enabled log the execution of the command
    if (client.config.debugMode) {
      client.logger.log(
        `Command ${command.name} has been executed by user ${msgData.author.tag} (${msgData.author.id})`
      );
    } else {
      client.actionLogger.logCommand(
        commandData.command.name,
        commandData.args,
        (commandData?.author as any).id
      );
    }

    return true;
  }
);
