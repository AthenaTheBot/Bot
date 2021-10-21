import Event from "../Classes/Event";

export default new Event("interactionCreate", (client, data): boolean => {
  if (!client.commandManager.isValidCommand(data.command.name)) return false;

  const command = client.commandManager.getCommand(data.command.name);

  command?.exec(client, data);
  return true;
});
