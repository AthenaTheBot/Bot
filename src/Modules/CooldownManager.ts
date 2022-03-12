import { UserCooldown, CooldownCommand } from "../Structures/Cooldown";

/**
 * Manages all cooldowns related with command usage.
 */
class CooldownManager {
  cooldowns: UserCooldown[];

  constructor() {
    this.cooldowns = [];
  }

  // Checks wheter the user is in command cooldown or not
  isInCooldown(userId: string, commandName: string): boolean {
    return this.cooldowns
      .find((x) => x.userId == userId)
      ?.commands.find((x) => x.name === commandName)
      ? true
      : false;
  }

  // Checks wheter the cooldown warning is sent or not
  isWarnSent(userId: string, commandName: string): boolean {
    return (
      this.cooldowns
        .find((x) => x.userId == userId)
        ?.commands?.find((x) => x.name == commandName)?.warnSent || false
    );
  }

  // Updates the warnSent state
  updateWarnSent(userId: string, commandName: string, newState: boolean): void {
    const cooldown = this.cooldowns.find((x) => x.userId == userId);

    if (!cooldown) return;

    const command = cooldown.commands.find((x) => x.name == commandName);

    if (!command) return;

    command.warnSent = newState;
  }

  // Adds command cooldown to a user
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

  // Removes one command cooldown of a user
  removeCooldown(userId: string, commandName: string) {
    const cooldown = this.cooldowns.find((x) => x.userId == userId);

    if (!cooldown) return;

    cooldown.removeCommand(commandName);

    if (cooldown.commands.length == 0) {
      this.cooldowns = this.cooldowns.filter((x) => x.userId != userId);
    }
  }

  // Clears all cooldowns of a user
  clearCoolwons(userId: string): void {
    const cooldown = this.cooldowns.find((x) => x.userId == userId);

    if (!cooldown) return;

    cooldown.clearCommands();
  }
}

export default CooldownManager;
