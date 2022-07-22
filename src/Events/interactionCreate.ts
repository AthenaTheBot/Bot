import { CommandContext, CommandTypes } from "../Structures/CommandContext";
import CommandUsage from "../Structures/CommandUsage";
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
    const commandCtx = new CommandContext(command, client, {
      type: CommandTypes.Interaction,
      data: interactionData,
      db: { user: user, guild: guild },
    });

    if (!commandCtx.executeable) return false;

    // Execute command
    command?.exec(commandCtx);

    // Crate command usage instance
    const commandUsage = new CommandUsage(
      command.name,
      commandCtx.args,
      interactionData?.member?.id,
      commandCtx?.guild?.id
    );

    // If the bot is in production mode save the command usage to the database.
    if (!client.config.debug.enabled) {
      commandUsage.saveUsage();
      // Send command usage embed to the log channel on Discord.
      commandUsage.reportUsage();
    }

    return true;
  }
);
