// Modules
import { Client, Intents } from "discord.js";

// Classes
import Logger from "./Classes/Logger";
import DatabaseManager from "./Classes/DatabaseManager";

// Interfaces
import { configInterface } from "./Interfaces";

/** Athena client class
 * @extends Client
 */
class AthenaClient extends Client {
  readonly config: configInterface;

  // Classes
  logger: Logger;
  dbManager: DatabaseManager;

  constructor(config: configInterface) {
    super({
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
      ],
    });

    // Config File
    this.config = config;

    // Managers
    this.logger = new Logger();
    this.dbManager = new DatabaseManager(this.config.db_url);
  }

  /** Function that initalizes the client of Athena */
  async initalize(): Promise<void> {
    this.dbManager.connect().then((success) => {
      if (success)
        this.logger.success("Successfully connected to database server.");
      else
        this.logger.error(
          "An error occured while tring to connect database server"
        );
    });

    try {
      await this.login(this.config.bot.token);
    } catch (err) {
      this.logger.error("Failed while trying to login into discord account.");
      return;
    }

    this.logger.success("Successfully logged in to discord account.");
  }
}

export default AthenaClient;
