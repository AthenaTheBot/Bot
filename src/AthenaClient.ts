// Modules
import figlet from "figlet";
import colors from "colors";
import { Client, Intents } from "discord.js";

colors.enable();

// Classes
import Logger from "./Modules/Logger";
import DatabaseManager from "./Modules/DatabaseManager";
import Utils from "./Modules/Utils";
import EventManager from "./Modules/EventManager";
import ErrorHandler from "./Modules/ErrorHandler";
import CommandManager, { CommandData } from "./Modules/CommandManager";
import PresenceManager from "./Modules/PresenceManager";
import GuildManager from "./Modules/GuildManager";
import UserManager from "./Modules/UserManager";
import LocaleManager from "./Modules/LocaleManager";
import CooldownManager from "./Modules/CooldownManager";
import Player from "./Modules/Player";
import StatPoster from "./Modules/StatPoster";
import TerminalHandler from "./Modules/TerminalHandler";
import { Config } from "./constants";

/** Athena base client class
 * @extends Client
 */
class AthenaClient extends Client {
  readonly config: Config;

  // Managers
  dbManager: DatabaseManager;
  eventManager: EventManager;
  commandManager: CommandManager;
  presenceManager: PresenceManager;
  guildManager: GuildManager;
  userManager: UserManager;
  localeManager: LocaleManager;
  cooldownManager: CooldownManager;

  // Player
  player: Player;

  // Stats Poster
  statPoster: StatPoster;

  // Handlers
  errorHandler: ErrorHandler;
  terminalHandler: TerminalHandler;

  // Utils
  logger: Logger;
  utils: Utils;

  constructor(config: Config) {
    super({
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES,
      ],
    });

    // Config File
    this.config = config;

    // Managers
    this.dbManager = new DatabaseManager(this.config.dbUrl);
    this.eventManager = new EventManager(this);
    this.commandManager = new CommandManager(this);
    this.presenceManager = new PresenceManager(this);
    this.guildManager = new GuildManager(this.dbManager);
    this.userManager = new UserManager(this.dbManager);
    this.localeManager = new LocaleManager();
    this.cooldownManager = new CooldownManager();

    // Player
    this.player = new Player(this);

    // Stat Poster
    this.statPoster = new StatPoster(this, this.config.bot.statPostInterval);

    // Handlers
    this.errorHandler = new ErrorHandler();
    this.terminalHandler = new TerminalHandler(this);

    // Utils
    this.logger = new Logger();
    this.utils = new Utils();
  }

  /** Function that initalizes the client of Athena */
  async initalize(): Promise<boolean> {
    console.clear();

    await new Promise((resolve) => {
      figlet(
        "ATHENA",
        {
          width: 400,
          horizontalLayout: "full",
        },
        (err, result) => {
          if (result) {
            console.log(result.red);
          }
          resolve(null);
        }
      );
    });

    this.errorHandler.checkErrors(true);

    this.dbManager.connect().then((success) => {
      if (success)
        this.logger.success("Successfully connected to database server.");
      else
        this.logger.error(
          "An error occured while trying to connect database server"
        );
    });

    await this.eventManager.registerEventsFromEventFolder();

    await this.localeManager.loadLocales();

    this.eventManager.listenEvents();

    try {
      await this.login(this.config.bot.token);
      this.logger.success("Successfully logged in to discord account.");
    } catch (err) {
      this.logger.error("Failed while trying to login into discord account.");
      process.exit(1);
    }

    if (!this.config.debug.enabled)
      await this.commandManager.removeGlobalCommands();

    await this.commandManager.registerCommandsFromCommandFolder();

    this.terminalHandler.listenTerminal();

    this.presenceManager.setPresence([
      {
        name: this.config.bot.activity,
        type: "LISTENING",
      },
    ]);

    this.statPoster.startPosting();

    return true;
  }

  async executeCommand(
    commandName: string,
    commandData: CommandData
  ): Promise<boolean> {
    const command = this.commandManager.getCommand(commandName);

    if (!command) return false;

    const success = await command.exec(commandData);

    return success;
  }
}

export default AthenaClient;
