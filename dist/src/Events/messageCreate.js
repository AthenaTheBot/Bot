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
const Event_1 = __importDefault(require("../Classes/Event"));
const CommandData_1 = require("../Classes/CommandData");
exports.default = new Event_1.default("messageCreate", (client, msgData) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (msgData.author.bot || !msgData.guild)
        return false;
    const guild = yield client.guildManager.fetch(msgData.guild.id, true);
    const user = yield client.userManager.fetch(msgData.author.id, true);
    if (!guild || !user)
        return false;
    if (!msgData.content.trim().startsWith((_a = guild === null || guild === void 0 ? void 0 : guild.settings) === null || _a === void 0 ? void 0 : _a.prefix))
        return false;
    const commandName = msgData.content
        .trim()
        .split(" ")[0]
        .split(guild.settings.prefix)
        .pop()
        .toLowerCase();
    if (!client.commandManager.isValidCommand(commandName))
        return false;
    const command = client.commandManager.getCommand(commandName);
    if (!command)
        return false;
    const commandData = new CommandData_1.CommandData(command, client, {
        type: CommandData_1.CommandDataTypes.Message,
        data: msgData,
        db: { user: user, guild: guild },
    });
    command === null || command === void 0 ? void 0 : command.exec(commandData);
    return true;
}));
