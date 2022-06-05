const fs = require("fs-extra");
const path = require("path");
const commander = require("commander");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const AdmZip = require("adm-zip");
const program = new commander.Command();
require("colors").enable();

let buildFolder = path.join(__dirname, "dist");
let commandsFolder = path.join(__dirname, "dist", "commands");
let localesFolder = path.join(__dirname, "locales");

program.version("1.0.4");

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
  program.log("Removing old build files...");

  await fs.rm(buildFolder, { recursive: true, force: true }).catch((err) => {
    console.log(err.message);
    process.exit(1);
  });

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

  const commandFiles = await fs
    .readdirSync(commandsFolder)
    .filter((x) => x.endsWith(".js"));
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

  const zip = new AdmZip();

  program.log("Writing new build files to a zip file.");

  zip.addLocalFolder(buildFolder, "/dist");

  zip.addLocalFolder(localesFolder, "/locales");

  zip.addLocalFile(path.join(__dirname, "package.json"), "", "package.json");

  zip.addLocalFile(path.join(__dirname, "yarn.lock"), "", "yarn.lock");

  zip.addLocalFile(
    path.join(__dirname, "config.build.json"),
    "",
    "config.json"
  );

  zip.writeZipPromise(path.join(__dirname, "..", "Athena_Build.zip"));

  program.log(
    `Successfully built files! Build file placed in: ${path.join(
      __dirname,
      "..",
      "Athena_Build.zip"
    )}`
  );
};

program.parse();
