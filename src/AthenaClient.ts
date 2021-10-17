// Modules
import { Client, Intents } from "discord.js";

// Classes
import Logger from "./Classes/Logger";
import DatabaseManager from "./Classes/DatabaseManager";

// Interfaces
import { configInterface } from "./Interfaces";
import Utils from "./Classes/Utils";
import EventManager from "./Classes/EventManager";
import ErrorHandler from "./Classes/ErrorHandler";

/** Athena client class
 * @extends Client
 */
class AthenaClient extends Client {
  readonly config: configInterface;

  // Managers
  dbManager: DatabaseManager;
  eventManager: EventManager;

  // Handlers
  errorHandler: ErrorHandler;

  // Utils
  logger: Logger;
  utils: Utils;

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
    this.dbManager = new DatabaseManager(this.config.db_url);
    this.eventManager = new EventManager(this);

    // Handlers
    this.errorHandler = new ErrorHandler(this.config);

    // Utils
    this.logger = new Logger();
    this.utils = new Utils();
  }

  /** Function that initalizes the client of Athena */
  async initalize(): Promise<void> {
    this.dbManager.connect().then((success) => {
      if (success)
        this.logger.success("Successfully connected to database server.");
      else
        this.logger.error(
          "An error occured while trying to connect database server"
        );
    });

    await this.eventManager.registerEventsFromEventFolder();

    this.eventManager.listenEvents();

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
