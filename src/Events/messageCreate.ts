import { CommandData, CommandDataTypes } from "../Structures/CommandData";
import { Permissions } from "../constants";
import Event from "../Structures/Event";
import CommandUsage from "../Structures/CommandUsage";

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
    if (!msgData.content.trim().startsWith(guild?.modules?.settings?.prefix))
      return false;

    // Parse command name from the message content
    const commandName = msgData.content
      .trim()
      .split(" ")[0]
      .split(guild?.modules?.settings?.prefix)
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
      if (commandData.executeFail?.reason == "USER_INSUFFICIENT_PERMS") {
        commandData.respond(commandData.locales.USER_INSUFFICIENT_PERMS, false);
      }
      return false;
    }

    // Execute command
    const commandSuccessfull = command?.exec(commandData);

    // Add cooldown to user
    client.cooldownManager.addCooldown(
      msgData.author.id,
      command.name,
      command.cooldown
    );

    // Crate command usage instance
    const commandUsage = new CommandUsage(
      command.name,
      commandData.args,
      msgData?.author?.id,
      commandData.guild.id,
      await commandSuccessfull
    );

    // If the bot is in production mode save the command usage to the database.
    if (!client.config.debug.enabled) {
      commandUsage.saveUsage();
    }

    // Send command usage embed to the log channel on Discord.
    commandUsage.reportUsage();

    return true;
  }
);
