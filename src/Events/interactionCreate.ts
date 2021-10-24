import Event from "../Classes/Event";
import {
  CommandInteractionOption,
  CommandInteractionOptionResolver,
} from "discord.js";

export default new Event(
  "interactionCreate",
  async (client, interactionData): Promise<boolean> => {
    // Fetch user and guilld data with a force arguement passed.
    const guild = await client.guildManager.fetch(
      interactionData.guild.id,
      true
    );
    const user = await client.userManager.fetch(interactionData.user.id, true);

    // If still guild and user data are not proper then do nothing.
    if (!guild || !user) return false;

    // Check wheter the comamnd is valid or not
    if (!client.commandManager.isValidCommand(interactionData.commandName))
      return false;

    // Get the command data through command manager
    const command = client.commandManager.getCommand(
      interactionData.commandName
    );

    // Initializing args array
    const args: CommandInteractionOption[] = [];

    // Parsing all arguements from interaction data
    for (var i = 0; i < interactionData.options.data.length; i++) {
      args.push(interactionData.options.data[i].value);
    }

    // Execute command
    command?.exec(client, interactionData, args);
    return true;
  }
);
