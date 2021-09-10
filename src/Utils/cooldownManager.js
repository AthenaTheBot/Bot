class cooldownManager {
    constructor(client) {
        this.client = client;
    }

    inCooldown(user, commandName) {

        let userCooldowns =  this.client.cooldowns.get(user);

        if (!userCooldowns) userCooldowns = this.client.cooldowns.set(user, []).get(user);

        const commandCooldown = userCooldowns?.find(x => x.cmd == commandName);

        if (!commandCooldown) return { cooldown: false };
        else return {
            cooldown: true,
            cmd: commandName,
            warnSent: commandCooldown.warnSent
        }
    }

    addCooldown(user, commandName, cooldownAmount) {

        let userCooldowns = this.client.cooldowns.get(user);

        if (!userCooldowns) userCooldowns = this.client.cooldowns.set(user, []).get(user);

        const commandCooldown = {
            cmd: commandName,
            warnSent: false
        };

        userCooldowns.push(commandCooldown);

        setTimeout(() => {
            userCooldowns = userCooldowns.filter(x => x.cmd != commandName);
            this.client.cooldowns.set(user, userCooldowns);
        }, cooldownAmount * 1000)

        return commandCooldown;
    }

    updateState(user, commandName, state) {

        let userCooldowns = this.client.cooldowns.get(user);

        if (!userCooldowns) userCooldowns = this.client.cooldowns.set(user, []).get(user);

        const commandCooldown = userCooldowns?.find(x => x.cmd == commandName);

        if (commandCooldown) {

            commandCooldown.warnSent = state;
        }

        return commandCooldown;
    }
}

module.exports = cooldownManager;