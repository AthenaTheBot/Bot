"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Event_1 = __importDefault(require("../Classes/Event"));
exports.default = new Event_1.default("interactionCreate", (client, data) => {
    if (!client.commandManager.isValidCommand(data.commandName))
        return false;
    const command = client.commandManager.getCommand(data.commandName);
    command === null || command === void 0 ? void 0 : command.exec(client, data);
    return true;
});
