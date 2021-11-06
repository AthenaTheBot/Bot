"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (commandManager) => {
    commandManager.registerCommand("play", ["p"], "Command for playing song in voice channels.", [
        {
            type: "STRING",
            name: "song",
            description: "Song name to play",
            required: true,
        },
    ], 4, [], ["SEND_MESSAGES"], (client, data, args) => {
        client.player.searchSong(args.join(" "));
        return true;
    });
};
