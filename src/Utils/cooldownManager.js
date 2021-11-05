class cooldownUser {
  constructor(userId, commands) {
    this.id = userId;
    this.commands = [commands];
  }
}

class cooldownCommand {
  constructor(cmdName, warnSent) {
    this.name = cmdName;
    this.warnSent = warnSent;
  }
}

class cooldownManager {
  constructor() {
    this.cooldowns = [];
  }

  isCommandInCooldown(userId, commandName) {
    return this.cooldowns
      .find((user) => user.id === userId)
      ?.commands.find((s) => s.name === commandName)
      ? true
      : false;
  }

  isCommandWarnSent(userId, commandName) {
    return this.cooldowns
      .find((user) => user.id === userId)
      ?.commands.find((x) => x.name === commandName).warnSent;
  }

  addCommandCooldown(userId, commandName, cooldownAmount) {
    let user = this.cooldowns.find((user) => user.id === userId);
    if (!user) {
      this.cooldowns.push(
        (user = new cooldownUser(
          userId,
          new cooldownCommand(commandName, false)
        ))
      );
    } else {
      if (user?.commands?.filter((x) => x.name === commandName).length != 0)
        return;
      user.commands.push(new cooldownCommand(commandName, false));
    }

    setTimeout(() => {
      this.removeCommandCooldown(userId, commandName);
    }, cooldownAmount);
  }

  updateCommandWarnState(userId, commandName, newState) {
    const user = this.cooldowns.find((user) => user.id === userId);
    user.commands.find((x) => x.name === commandName).warnSent = newState;
  }

  removeCommandCooldown(userId, command) {
    const user = this.cooldowns.find((x) => x.id === userId);
    if (!user) return false;

    user.commands = user.commands.filter((x) => x.name !== command);
    return true;
  }

  addUserCooldown() {}

  removeUserCooldown() {}
}

module.exports = { cooldownManager, cooldownCommand, cooldownUser };
