"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (commandManager) => {
    commandManager.registerCommand("prefix", [], "Change the prefix of Athena for your server and use the best fit for your server!", [
        {
            type: "STRING",
            name: "Prefix",
            description: "The prefix that you want to set",
            required: false,
        },
    ], 5, ["ADMINISTRATOR"], ["SEND_MESSAGES", "EMBED_LINKS"], (commandData) => __awaiter(void 0, void 0, void 0, function* () {
        if (commandData.args.length === 0) {
            try {
                commandData.respond(commandData.locales.CURRENT_PREFIX.replace("$prefix", commandData.db.guild.settings.prefix), true);
            }
            catch (err) {
                return false;
            }
            return true;
        }
        else {
            const success = yield commandData.client.dbManager.updateDocument("guilds", commandData.guild.id, { $set: { "settings.prefix": commandData.args[0] } });
            if (success) {
                commandData.respond(commandData.locales.SUCCESS, true);
            }
            else {
                commandData.respond(commandData.locales.ERROR, true);
            }
            return true;
        }
    }));
    commandManager.registerCommand("adminrole", [], "Command for setting admin role.", [
        {
            type: "ROLE",
            name: "Role",
            description: "The role that you want to set as bot admin.",
            required: true,
        },
    ], 4, ["ADMINISTRATOR"], ["EMBED_LINKS"], (commandData) => __awaiter(void 0, void 0, void 0, function* () {
        let mentionedRole;
        if (commandData.type === "Interaction") {
            mentionedRole = yield commandData.guild.roles.fetch(commandData.args[0]);
        }
        else {
            mentionedRole = commandData.raw.mentions.roles.first();
        }
        if (!(mentionedRole === null || mentionedRole === void 0 ? void 0 : mentionedRole.id)) {
            commandData.respond(commandData.locales.SPECIFY_ROLE, true);
            return false;
        }
        const success = yield commandData.client.guildManager.updateGuild(commandData.guild.id, {
            $set: { "modules.moderationModule.adminRole": mentionedRole.id },
        });
        if (success) {
            commandData.respond(commandData.locales.SUCCESS, true);
        }
        else {
            return commandData.respond(commandData.locales.ERROR, true);
        }
        return true;
    }));
    commandManager.registerCommand("modrole", [], "Command for setting admin role.", [
        {
            type: "ROLE",
            name: "Role",
            description: "The role that you want to set as bot admin.",
            required: true,
        },
    ], 4, ["ADMINISTRATOR"], ["EMBED_LINKS"], (commandData) => __awaiter(void 0, void 0, void 0, function* () {
        let mentionedRole;
        if (commandData.type === "Interaction") {
            mentionedRole = yield commandData.guild.roles.fetch(commandData.args[0]);
        }
        else {
            mentionedRole = commandData.raw.mentions.roles.first();
        }
        if (!(mentionedRole === null || mentionedRole === void 0 ? void 0 : mentionedRole.id)) {
            commandData.respond(commandData.locales.SPECIFY_ROLE, true);
            return false;
        }
        const success = yield commandData.client.guildManager.updateGuild(commandData.guild.id, {
            $set: { "modules.moderationModule.modRole": mentionedRole.id },
        });
        if (success) {
            commandData.respond(commandData.locales.SUCCESS, true);
        }
        else {
            commandData.respond(commandData.locales.ERROR, true);
            return false;
        }
        return true;
    }));
};
