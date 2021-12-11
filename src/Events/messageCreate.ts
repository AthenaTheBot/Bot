import Event from "../Classes/Event";
import { CommandData, CommandDataTypes } from "../Classes/CommandData";

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

    if (!commandData.executeable) {
      if (commandData.executeFailReason == "USER_INSUFFICIENT_PERMS")
        commandData.respond(commandData.locales.INSUFFICIENT_PERMS, false);
      return false;
    }

    // Execute command
    command?.exec(commandData);

    return true;
  }
);
