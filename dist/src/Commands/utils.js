"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (commandManager) => {
    commandManager.registerCommand("ping", [], "Simple ping pong command whether to check bot is online or not.", [], 4, [], ["SEND_MESSAGES"], (commandData) => {
        commandData.respond(commandData.locales.PONG);
        return true;
    });
};
