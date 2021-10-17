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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("./Command"));
class CommandManager {
    constructor() {
        this.commands = [];
    }
    registerCommand(name, aliases, description, usage, cooldown, requiredPerms, requiredBotPerms, exec) {
        this.commands.push(new Command_1.default(name, aliases, description, usage, cooldown, requiredPerms, requiredBotPerms, exec));
    }
    registerCommandsFromCommandFolder() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.commands;
        });
    }
    removeCommand(cmdName) {
        this.commands = this.commands.filter((x) => x.name !== cmdName);
    }
    isValidCommand(cmdName) {
        return this.commands.filter((x) => x.name === cmdName).length !== 0
            ? true
            : false;
    }
}
exports.default = CommandManager;
