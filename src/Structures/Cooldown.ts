class CooldownCommand {
  name: string;
  warnSent: boolean;

  constructor(name: string, warnSent = false) {
    this.name = name;
    this.warnSent = warnSent;
  }
}

class UserCooldown {
  userId: string;
  commands: CooldownCommand[];

  constructor(userId: string, commands: CooldownCommand[]) {
    this.userId = userId;
    this.commands = [...commands];
  }

  addCommand(name: string): void {
    this.commands.push(new CooldownCommand(name));
  }

  removeCommand(name: string): void {
    this.commands = this.commands.filter((x) => x.name != name);
  }

  clearCommands() {
    this.commands = [];
  }
}

export default UserCooldown;
export { UserCooldown, CooldownCommand };
