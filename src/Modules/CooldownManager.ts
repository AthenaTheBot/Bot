import { UserCooldown, CooldownCommand } from "../Structures/Cooldown";

class CooldownManager {
  cooldowns: UserCooldown[];

  constructor() {
    this.cooldowns = [];
  }

  isInCooldown(userId: string, commandName: string): boolean {
    return this.cooldowns
      .find((x) => x.userId == userId)
      ?.commands.find((x) => x.name === commandName)
      ? true
      : false;
  }

  isWarnSent(userId: string, commandName: string): boolean {
    return (
      this.cooldowns
        .find((x) => x.userId == userId)
        ?.commands?.find((x) => x.name == commandName)?.warnSent || false
    );
  }

  updateWarnSent(userId: string, commandName: string, newState: boolean): void {
    const cooldown = this.cooldowns.find((x) => x.userId == userId);

    if (!cooldown) return;

    const command = cooldown.commands.find((x) => x.name == commandName);

    if (!command) return;

    command.warnSent = newState;
  }

  addCooldown(userId: string, commandName: string, duration: number): void {
    let cooldown: any = this.cooldowns.find((x) => x.userId == userId);

    if (!cooldown) {
      cooldown = new UserCooldown(userId, [new CooldownCommand(commandName)]);
      this.cooldowns.push(cooldown);
    }

    cooldown.addCommand(commandName);

    setTimeout(() => {
      cooldown.removeCommand(commandName);
    }, duration * 1000);
  }

  removeCooldown(userId: string, commandName: string) {
    const cooldown = this.cooldowns.find((x) => x.userId == userId);

    if (!cooldown) return;

    cooldown.removeCommand(commandName);

    if (cooldown.commands.length == 0) {
      this.cooldowns = this.cooldowns.filter((x) => x.userId != userId);
    }
  }

  clearCoolwons(userId: string): void {
    const cooldown = this.cooldowns.find((x) => x.userId == userId);

    if (!cooldown) return;

    cooldown.clearCommands();
  }
}

export default CooldownManager;
