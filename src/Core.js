const { Client, Intents } = require("discord.js");

const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const dbManager = require("./Utils/dbManager");
const { cooldownManager } = require("./Utils/cooldownManager");

class Core extends Client {
  constructor() {
    super({
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_WEBHOOKS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.DIRECT_MESSAGES,
      ],
    });

    try {
      this.config = require("../config.js");
    } catch (err) {
      if (err.code == "ENOENT") {
        this.log(
          2,
          "Cannot start bot without a config file, exiting the process."
        );
        process.exit();
      } else {
        this.log(2, err);
      }
    }

    // Command Related
    this.commands = new Map();
    this.commandAliases = new Map();
    this.locales = new Map();

    // Cooldown Manager
    this.cooldownManager = new cooldownManager();

    // Database Related
    this.dbConnection = null;
    this.dbManager = new dbManager(this);
    this.dbCache = {
      users: new Map(),
      servers: new Map(),
    };

    // Song States
    this.songStates = new Map();
  }

  log(type, msg) {
    if (typeof type != "number" || !msg) return;

    switch (type) {
      case 1:
        type = "[\x1b[37m\x1b[42mSUCCESS\x1b[0m] :";
        break;

      case 2:
        type = "[\x1b[37m\x1b[41mERROR\x1b[0m]   :";
        break;

      case 3:
        type = "[\x1b[37m\x1b[43mWARN\x1b[0m]    :";
        break;

      default:
        break;
    }

    console.log(type, msg);
  }

  loadCommands() {
    if (!this.config || !this.config.PATHS.COMMANDS) {
      this.log(3, "Cannot find any commands directory so skipping function.");
      return;
    }

    const categories = fs.readdirSync(
      path.join(__dirname, this.config.PATHS.COMMANDS)
    );

    categories.forEach((category) => {
      const categoryCommands = fs
        .readdirSync(path.join(__dirname, this.config.PATHS.COMMANDS, category))
        .filter((file) => file.endsWith(".js"));

      if (categoryCommands.length == 0) return;

      categoryCommands.forEach((command) => {
        let cmd;
        try {
          cmd = new (require(path.join(
            __dirname,
            this.config.PATHS.COMMANDS,
            category,
            command
          )))();
        } catch (err) {
          console.log(err);
          this.log(
            3,
            `Found one command without a proper export, ignorning command. (Command: ${command})`
          );
          return;
        }

        if (!cmd.name || !cmd.description) {
          this.log(
            3,
            `Found one command without a name or description, ignoring command. (Command: ${command})`
          );
          return;
        }

        if (cmd.category != category) {
          this.log(
            3,
            `Found one command with a conflict between the category name and category folder name, ignoring command. (Command: ${command})`
          );
          return;
        }

        this.application.commands.create({
          name: cmd.name,
          description: cmd.description,
          options: cmd.options,
        });

        this.commands.set(cmd.name, cmd);

        cmd.aliases.forEach((alias) => {
          if (alias.length == 0) {
            this.log(
              3,
              `Found one alias with length 0 on command ${cmd.name} ignoring alias.`
            );
            return;
          }
          this.commandAliases.set(alias, cmd);
        });
      });
    });

    this.log(1, "Successfully loaded all commands.");
    return this.commands;
  }

  loadEvents() {
    if (!this.config || !this.config.PATHS.EVENTS) {
      this.log(3, "Cannot find any events directory, skipping function.");
      return;
    }

    const eventFiles = fs
      .readdirSync(path.join(__dirname, this.config.PATHS.EVENTS))
      .filter((file) => file.endsWith(".js"));

    eventFiles.forEach((eventFile) => {
      const event = new (require(path.join(
        __dirname,
        this.config.PATHS.EVENTS,
        eventFile
      )))();

      if (
        eventFile.split(".js").shift().toLocaleLowerCase() !=
        event.name.toLocaleLowerCase()
      )
        return this.log(
          3,
          "Found one event with a conflict between file name and event name."
        );

      this.on(event.name, (data) => {
        try {
          event.run(this, data);
        } catch (err) {
          this.log(2, err);
        }
      });
    });

    this.log(1, "Successfully loaded all events!");
    return;
  }

  loadLocales() {
    if (!this.config || !this.config.PATHS.LOCALES) {
      this.log(3, "Cannot find any locales directory, skipping function.");
      return;
    }

    const availableLocales = fs.readdirSync(path.join(__dirname, "Locales"));

    availableLocales.forEach((locale) => {
      const localeObj = { main: null, locales: [] };

      let mainLocaleCheck;
      try {
        mainLocaleCheck = require(path.join(
          __dirname,
          "Locales",
          locale,
          "main.json"
        ));
      } catch (err) {
        if (err.code == "MODULE_NOT_FOUND") {
          this.log(
            3,
            "Found one locale without a main locale file, skipping locale. (Locale " +
              locale +
              ")"
          );
          return;
        }
        this.log(2, err);
        return;
      }

      localeObj.main = mainLocaleCheck;

      this.commands.forEach((command) => {
        let localeCheck;
        try {
          localeCheck = require(path.join(
            __dirname,
            "Locales",
            locale,
            command.category,
            command.name + ".json"
          ));
        } catch (err) {
          if (err.code == "MODULE_NOT_FOUND") {
            this.log(
              3,
              "Found one comamnd without a proper locale. (Command " +
                command.name +
                ") (Locale " +
                locale +
                ")"
            );
            return;
          }
          this.log(2, err);
          return;
        }

        localeObj.locales.push({ cmd: command.name, content: localeCheck });
      });

      this.locales.set(locale, localeObj);
    });

    this.log(1, "Successfully loaded all locales!");
  }

  async connectDB() {
    if (!this.config || !this.config.DB_URL) {
      this.log(
        3,
        "Cannot find any database url in config file, skipping function."
      );
      return;
    }

    try {
      await mongoose.connect(this.config.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        keepAlive: true,
      });
    } catch (err) {
      this.log(2, err);
      return;
    }

    this.log(1, "Successfully connected to database server.");

    this.dbConnection = mongoose.connection;
    this.dbManager.setUsable();
    return;
  }

  init() {
    if (!this.config || !this.config.TOKEN) {
      this.log(2, "Cannot initalize the bot without a token.");
      return;
    }

    this.login(this.config.TOKEN);

    this.once("ready", async () => {
      await this.loadCommands();
      await this.loadLocales();

      await this.loadEvents();
      await this.connectDB();

      require("./Website/server/main");

      this.user.setActivity("at!help | athena.bot");

      setInterval(() => {
        this.user.setActivity("at!help | athena.bot");
      }, 10 * 60 * 1000);

      this.log(1, "Athena is ready to use! Logged as " + this.user.tag);
      return this;
    });
  }

  isCommand(cmd) {
    if (this.commands.get(cmd)) {
      return this.commands.get(cmd);
    } else if (this.commandAliases.get(cmd)) {
      return this.commandAliases.get(cmd);
    }

    return false;
  }
}

module.exports = Core;
