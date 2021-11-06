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
import CommandManager from "./Classes/CommandManager";
import PresenceManager from "./Classes/PresenceManager";
import GuildManager from "./Classes/GuildManager";
import UserManager from "./Classes/UserManager";
import Player from "./Classes/Player";

/** Athena client class
 * @extends Client
 */
class AthenaClient extends Client {
  readonly config: configInterface;

  // Managers
  dbManager: DatabaseManager;
  eventManager: EventManager;
  commandManager: CommandManager;
  presenceManager: PresenceManager;
  guildManager: GuildManager;
  userManager: UserManager;

  // Player
  player: Player;

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
    this.commandManager = new CommandManager(this);
    this.presenceManager = new PresenceManager(this);
    this.guildManager = new GuildManager(this.dbManager);
    this.userManager = new UserManager(this.dbManager);

    // Player
    this.player = new Player();

    // Handlers
    this.errorHandler = new ErrorHandler(this.config);

    // Utils
    this.logger = new Logger();
    this.utils = new Utils();
  }

  /** Function that initalizes the client of Athena */
  async initalize(): Promise<boolean> {
    this.dbManager.connect().then((success) => {
      if (success)
        this.logger.success("Successfully connected to database server.");
      else
        this.logger.error(
          "An error occured while trying to connect database server"
        );
    });

    await this.eventManager.registerEventsFromEventFolder();

    await this.commandManager.registerCommandsFromCommandFolder();

    this.eventManager.listenEvents();

    try {
      await this.login(this.config.bot.token);
      this.logger.success("Successfully logged in to discord account.");
    } catch (err) {
      this.logger.error("Failed while trying to login into discord account.");
      return false;
    }

    this.presenceManager.setPresence([
      {
        name: this.config.bot.activity,
        type: "LISTENING",
      },
    ]);

    return true;
  }
}

export default AthenaClient;
