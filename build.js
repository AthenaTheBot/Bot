const fs = require("fs");
const path = require("path");
const args = process.argv.slice(2, process.argv.length);
const { Permissions } = require("./dist/src/Classes/PermissionResolver");

let buildFolder = path.join(__dirname, "dist");
let commandsFolder = path.join(__dirname, "dist", "src", "commands");
let localesFolder = path.join(__dirname, "locales");

const buildCommands = async () => {
  const commandFiles = await fs.readdirSync(commandsFolder);
  const commands = [];

  for (var i = 0; i < commandFiles.length; i++) {
    const exec = await import(
      "file:///" + path.join(commandsFolder, commandFiles[i])
    );

    exec.default.default({
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

  try {
    fs.writeFileSync(
      path.join(__dirname, "commands.json"),
      JSON.stringify(commands, null, 2),
      "utf-8"
    );
  } catch (err) {
    console.log("An error occured while writing commands data file.");
    console.log(err);
    return false;
  }

  console.log("Successfully wrote commands data file.");

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

const build = async () => {
  // TODO: Use webpack to bundler all javascript files into one file
  // ! https://stackoverflow.com/questions/34474651/typescript-compile-to-single-file

  const baseFolderPath = path.join(__dirname, "..", "Athena-Build");

  if (await fs.existsSync(baseFolderPath)) {
    console.log(
      `Found one build folder in ${baseFolderPath}, please remove that folder before getting another build.`
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
  fs.mkdirSync(path.join(__dirname, "errors"));

  return true;
};

// TODO: Detailed arguement parsing
if (args.includes("--build-commands")) {
  buildCommands();
} else {
  build();
}
