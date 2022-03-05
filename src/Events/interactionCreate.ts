import { CommandData, CommandDataTypes } from "../Structures/CommandData";
import Event from "../Structures/Event";

export default new Event(
  "interactionCreate",
  async (client, interactionData): Promise<boolean> => {
    if (!interactionData.guild) return false;

    // Check wheter the comamnd is valid or not.
    if (!client.commandManager.isValidCommand(interactionData.commandName))
      return false;

    // Defer the interaction
    await interactionData.deferReply();

    // Fetch user and guilld data with a force arguement passed.
    const guild = await client.guildManager.fetch(
      interactionData.guild.id,
      true
    );
    const user = await client.userManager.fetch(interactionData.user.id, true);

    // If still guild and user data are not proper then do nothing.
    if (!guild || !user) return false;

    // Get the command data through command manager.
    const command = client.commandManager.getCommand(
      interactionData.commandName
    );

    // If command is not valid do not execute the command
    if (!command) return false;

    // Command data
    const commandData = new CommandData(command, client, {
      type: CommandDataTypes.Interaction,
      data: interactionData,
      db: { user: user, guild: guild },
    });

    if (!commandData.executeable) return false;

    // Execute command
    command?.exec(commandData);

    // If debug mode is enabled log the execution of the command
    if (client.config.debug.enabled) {
      client.logger.log(
        `Command ${command.name} has been executed by user ${interactionData.member.user.tag} (${interactionData.member.user.id})`
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
