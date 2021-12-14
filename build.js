const fs = require("fs");
const path = require("path");
const args = process.argv.slice(2, process.argv.length);
const { Permissions } = require("./dist/src/Classes/PermissionResolver");
let commandsFolder = path.join(__dirname, "dist", "src", "commands");

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

const build = () => {
  // TODO: Use webpack to bundler all javascript files into one file
  // ! https://stackoverflow.com/questions/34474651/typescript-compile-to-single-file

  return true;
};

// TODO: Detailed arguement parsing
if (args.includes("--build-commands")) {
  buildCommands();
} else {
  build();
}
