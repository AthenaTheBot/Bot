const fs = require("fs-extra");
const path = require("path");
const commander = require("commander");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const program = new commander.Command();
let Permissions = null;
require("colors").enable();

let buildFolder = path.join(__dirname, "dist");
let commandsFolder = path.join(__dirname, "dist", "commands");
let localesFolder = path.join(__dirname, "locales");

program.version("1.0.3");

program
  .command("build")
  .option("--commands", "Gets a new build of commands")
  .description("Gets a new build of Athena.")
  .action(async ({ commands }) => {
    if (commands) {
      buildCommands();
    } else {
      buildBot();
    }
  });

program.log = (msg) => {
  console.log("[" + "athena-build".bgBlue + "]:", msg.trim());
};

program.panicQuit = (reason) => {
  program.log(reason);

  process.exit(1);
};

const compileSourceCode = async () => {
  program.log("Compiling typescript code...");

  const { stdout, stderr } = await exec("tsc");

  if (stderr) {
    program.panicQuit("An error occured while compiling typescript code.");
  }

  if (stdout) console.log(stdout);

  program.log("Successfully compiled typescript code.");

  return;
};

const buildCommands = async () => {
  await compileSourceCode();

  const commandFiles = await fs.readdirSync(commandsFolder);
  const commands = [];

  program.log("Reading current Athena build files.");

  for (let i = 0; i < commandFiles.length; i++) {
    const commandFile = await import(
      "file:///" + path.join(commandsFolder, commandFiles[i])
    ).then((commandExports) => {
      const commandExportNames = Object.getOwnPropertyNames(
        commandExports
      ).filter((x) => x !== "__esModule" && x !== "default");
      const exports = [];

      for (let i = 0; i < commandExportNames.length; i++) {
        if (commandExports[commandExportNames[i]]) {
          exports.push(commandExports[commandExportNames[i]]);
        }
      }

      return exports;
    });

    commandFile.forEach((command) => {
      const requiredPerms = [];
      const requiredBotPerms = [];
      const usages = [];

      command.requiredPerms.all.forEach((perm) => {
        requiredPerms.push(perm);
      });

      command.requiredBotPerms.all.forEach((perm) => {
        requiredBotPerms.push(perm);
      });

      command.options.forEach((option) => {
        usages.push(`<${option.name}>`);
      });

      commands.push({
        name: command.name,
        aliases: command.aliases,
        description: command.description,
        category: commandFiles[i].replace(".js", ""),
        usage: usages.join(" "),
        cooldown: command.cooldown,
        required_perms: requiredPerms,
        required_bot_perms: requiredBotPerms,
      });
    });
  }

  program.log("Writing commands build file.");

  try {
    fs.writeFileSync(
      path.join(__dirname, "commands.json"),
      JSON.stringify(commands, null, 2),
      "utf-8"
    );
  } catch (err) {
    program.panicQuit("An error occured while writing commands data file.");
  }

  program.log("Commands file write process has finished.");
};

const buildBot = async () => {
  await compileSourceCode();

  Permissions = require("./dist/Modules/PermissionResolver");

  program.log("Writing new build files of Athena.");

  const baseFolderPath = path.join(__dirname, "..", "Athena-Build");

  if (await fs.existsSync(baseFolderPath)) {
    program.log("Found an old build folder, removing it..");

    await fs.rm(baseFolderPath).catch(() => {
      program.panicQuit(
        "An error occured while removing old build folder, please remove the old build folder before building Athena."
      );
    });

    program.log("Removed old build folder.");
  }

  await fs.ensureDir(baseFolderPath).catch(() => {
    program.panicQuit("An error occuredw while creating build folder.");
  });

  // Copy base folder
  await fs.copy(buildFolder, path.join(baseFolderPath, "dist")).catch(() => {
    program.panicQuit("An error occured while copying build files.");
  });

  // Copy locales
  await fs
    .copy(localesFolder, path.join(baseFolderPath, "locales"))
    .catch(() => {
      program.panicQuit("An error occured while copying locale folders.");
    });

  // Copy package and lock files
  await fs
    .copyFile(
      path.join(__dirname, "package.json"),
      path.join(baseFolderPath, "package.json")
    )
    .catch(() => {
      program.panicQuit("An error occured while copying package.json file.");
    });

  await fs
    .copyFile(
      path.join(__dirname, "yarn.lock"),
      path.join(baseFolderPath, "yarn.lock")
    )
    .catch(() => {
      program.panicQuit("An error occured while copying yarn.lock file.");
    });

  // Copy config file
  await fs
    .copyFile(
      path.join(__dirname, "config.build.json"),
      path.join(baseFolderPath, "config.json")
    )
    .catch(() => {
      program.panicQuit("An error occured while copying config file.");
    });

  // Create error folder
  await fs.mkdir(path.join(baseFolderPath, "errors")).catch(() => {
    program.panicQuit("An error occured while creating errors directory.");
  });

  program.log("Bot code compilation has finished.");
};

program.parse();
