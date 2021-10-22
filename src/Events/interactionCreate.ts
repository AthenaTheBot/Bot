import Event from "../Classes/Event";

export default new Event("interactionCreate", (client, data): boolean => {
  if (!client.commandManager.isValidCommand(data.commandName)) return false;

  const command = client.commandManager.getCommand(data.commandName);

  command?.exec(client, data);
  return true;
});
