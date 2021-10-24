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
    ], 5, ["ADMINISTRATOR"], ["EMBED_LINKS"], (client, data, args) => __awaiter(void 0, void 0, void 0, function* () {
        data.reply("Prefix command executed!");
        return true;
    }));
};
