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
    commandManager.registerCommand("play", ["p"], "Play song in a voice channel.", [], 4, [], ["SEND_MESSAGES"], (client, data, args) => __awaiter(void 0, void 0, void 0, function* () {
        const song = args.join(" ");
        if (song.length === 0)
            return false;
        const res = yield client.player.searchSong(args.join(" "));
        console.log(res);
        return true;
    }));
};
