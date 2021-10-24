import Event from "../Classes/Event";

export default new Event(
  "messageCreate",
  async (client, msgData): Promise<boolean> => {
    // Fetch user and guilld data with a force arguement passed.
    const guild = await client.guildManager.fetch(msgData.guild.id, true);
    const user = await client.userManager.fetch(msgData.author.id, true);

    // If still guild and user data are not proper then do nothing.
    if (!guild || !user) return false;

    // Parse command name from the message content
    const commandName = msgData.content
      .trim()
      .split(" ")[0]
      .split(guild.settings.prefix)
      .pop();

    // Check wheter the comamnd is valid or not
    if (!client.commandManager.isValidCommand(commandName)) return false;

    // Parse message aruements from the message content
    const args = msgData.content.trim().split(" ").slice(1);

    // Attaching guild and user data to the guild and user object.
    msgData.guild.data = guild;
    msgData.member.data = user;

    // Get the command data through command manager
    const command = client.commandManager.getCommand(commandName);

    // Execute command
    command?.exec(client, msgData, args);

    return true;
  }
);
