const fs = require("fs");
const path = require("path");
const commander = require("commander");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const program = new commander.Command();
const { Permissions } = require("./dist/src/Classes/PermissionResolver");
require("colors").enable();

let buildFolder = path.join(__dirname, "dist");
let commandsFolder = path.join(__dirname, "dist", "src", "commands");
let localesFolder = path.join(__dirname, "locales");

program.version("1.0.0");

program
  .command("build")
  .option("--commands", "Gets a new build of commands")
  .description("Gets a new build of Athena.")
  .action(({ commands }) => {
    if (commands) {
      buildCommands();
    } else {
      buildBot();
    }
  });

program.log = (msg) => {
  console.log("[" + "athena-build".bgBlue + "]:", msg.trim());
};

const buildCommands = async () => {
  const commandFiles = await fs.readdirSync(commandsFolder);
  const commands = [];

  program.log("Reading current Athena build files.");

  for (var i = 0; i < commandFiles.length; i++) {
    const execFile = await import(
      "file:///" + path.join(commandsFolder, commandFiles[i])
    );

    execFile.default.default({
      registerCommand: (
        cmdName,
        cmdAliases,
        cmdDesc,
        cmdUsage,
        cmdCooldown,
        cmdRequiredPerms,
        cmdRequiredBotPerms
      ) => {
        const usages = [];

        cmdUsage.forEach((usage) => {
          usages.push(`<${usage.name}>`);
        });

        const requiredPerms = [];
        cmdRequiredPerms.forEach((perm) => {
          requiredPerms.push(Permissions[perm]);
        });

        const requiredBotPerms = [];
        cmdRequiredBotPerms.forEach((perm) => {
          requiredBotPerms.push(Permissions[perm]);
        });

        commands.push({
          name: cmdName,
          aliases: cmdAliases,
          description: cmdDesc,
          category: commandFiles[i].replace(".js", ""),
          usage: usages.join(" "),
          cooldown: cmdCooldown,
          required_perms: requiredPerms,
          required_bot_perms: requiredBotPerms,
        });
      },
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
    program.log("An error occured while writing commands data file.");
    program.log(err);
    return false;
  }

  program.log("Commands file write process has finished.");

  return true;
};

function copyFileSync(source, target) {
  var targetFile = target;

  // If target is a directory, a new file with the same name will be created
  if (fs.existsSync(target)) {
    if (fs.lstatSync(target).isDirectory()) {
      targetFile = path.join(target, path.basename(source));
    }
  }

  fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyFolderRecursiveSync(source, target) {
  var files = [];

  // Check if folder needs to be created or integrated
  var targetFolder = path.join(target, path.basename(source));
  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder);
  }

  // Copy
  if (fs.lstatSync(source).isDirectory()) {
    files = fs.readdirSync(source);
    files.forEach(function (file) {
      var curSource = path.join(source, file);
      if (fs.lstatSync(curSource).isDirectory()) {
        copyFolderRecursiveSync(curSource, targetFolder);
      } else {
        copyFileSync(curSource, targetFolder);
      }
    });
  }
}

const buildBot = async () => {
  program.log("Compiling typescript code...");

  // Firstly get a new build of Athena
  const { stdout, stderr } = await exec("tsc");

  if (stderr) {
    program.log("An error occured while compiling typescript code.");
    program.log(stderr);
    return;
  }

  if (stdout) console.log(stdout);

  program.log("Code compilation is done.");

  program.log("Writing new build files of Athena.");

  const baseFolderPath = path.join(__dirname, "..", "Athena-Build");

  if (await fs.existsSync(baseFolderPath)) {
    program.log(
      `Found one build folder in "${baseFolderPath}", please remove that folder before getting another build.`
    );

    return false;
  }

  fs.mkdirSync(baseFolderPath);

  // Copy base folder
  copyFolderRecursiveSync(buildFolder, baseFolderPath);

  // Copy locales
  copyFolderRecursiveSync(localesFolder, baseFolderPath);

  // Copy package and lock files
  fs.copyFileSync(
    path.join(__dirname, "package.json"),
    path.join(baseFolderPath, "package.json")
  );

  fs.copyFileSync(
    path.join(__dirname, "yarn.lock"),
    path.join(baseFolderPath, "yarn.lock")
  );

  // Copy config file
  fs.copyFileSync(
    path.join(__dirname, "config.build.json"),
    path.join(baseFolderPath, "config.json")
  );

  // Create error folder
  fs.mkdirSync(path.join(baseFolderPath, "errors"));

  program.log("Bot code compilation has finished.");

  return true;
};

program.parse();
