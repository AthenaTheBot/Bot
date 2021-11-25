"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Command {
    constructor(name, aliases, description, options, cooldown, requiredPerms, requiredBotPerms, exec) {
        this.name = name;
        this.aliases = aliases;
        this.description = description;
        this.options = options;
        this.cooldown = cooldown;
        this.requiredPerms = requiredPerms;
        this.requiredBotPerms = requiredBotPerms;
        this.exec = exec;
    }
}
exports.default = Command;
