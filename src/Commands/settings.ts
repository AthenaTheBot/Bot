import CommandManager from "../Classes/CommandManager";

export default (commandManager: CommandManager) => {
  commandManager.registerCommand(
    "prefix",
    [],
    "Change the prefix of Athena for your server and use the best fit for your server!",
    [
      {
        type: "STRING",
        name: "Prefix",
        description: "The prefix that you want to set",
        required: false,
      },
    ],
    5,
    ["ADMINISTRATOR"],
    ["EMBED_LINKS"],
    async (client, data, args): Promise<boolean> => {
      data.reply("Prefix command executed!");
      return true;
    }
  );
};
