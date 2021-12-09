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
exports.default = new Event_1.default("interactionCreate", (client, interactionData) => __awaiter(void 0, void 0, void 0, function* () {
    if (!interactionData.guild)
        return false;
    const guild = yield client.guildManager.fetch(interactionData.guild.id, true);
    const user = yield client.userManager.fetch(interactionData.user.id, true);
    if (!guild || !user)
        return false;
    if (!client.commandManager.isValidCommand(interactionData.commandName))
        return false;
    const command = client.commandManager.getCommand(interactionData.commandName);
    if (!command)
        return false;
    const commandData = new CommandData_1.CommandData(command, client, {
        type: CommandData_1.CommandDataTypes.Interaction,
        data: interactionData,
        db: { user: user, guild: guild },
    });
    command === null || command === void 0 ? void 0 : command.exec(commandData);
    return true;
}));
