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
const voice_1 = require("@discordjs/voice");
exports.default = (commandManager) => {
    commandManager.registerCommand("play", ["p"], "Play song in a voice channel.", [], 4, [], ["SEND_MESSAGES"], (commandData) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        const songRequest = commandData.args.join(" ");
        if (!songRequest)
            return commandData.respond("Error! no song query");
        const song = yield commandData.client.player.searchSong(songRequest);
        if (!song)
            return commandData.respond("Song not found!");
        const serverListener = commandData.client.player.listeners.get(commandData.guild.id);
        if (!((_c = (_b = (_a = commandData === null || commandData === void 0 ? void 0 : commandData.author) === null || _a === void 0 ? void 0 : _a.voice) === null || _b === void 0 ? void 0 : _b.channel) === null || _c === void 0 ? void 0 : _c.id))
            return commandData.respond("Join a voice channel");
        if (serverListener && (serverListener === null || serverListener === void 0 ? void 0 : serverListener.listening)) {
            serverListener.queue.push(song);
            commandData.client.player.listeners.set(commandData.guild.id, serverListener);
            return commandData.respond("Added to queue " + song.title);
        }
        commandData.client.player.serveGuild(commandData.guild.id, commandData.author.voice.channel.id, commandData.channel.id, commandData.guild.voiceAdapterCreator, song);
        commandData.respond("Playing now: " + song.title);
        return true;
    }));
    commandManager.registerCommand("disconnect", ["dc"], "Disconnects from voice channel if exits.", [], 4, [], ["SEND_MESSAGES"], (commandData) => __awaiter(void 0, void 0, void 0, function* () {
        const connection = (0, voice_1.getVoiceConnection)(commandData.guild.id);
        connection === null || connection === void 0 ? void 0 : connection.destroy();
        commandData.respond("Ok!");
        return true;
    }));
    commandManager.registerCommand("skip", ["s"], "Skips to another song in the queue.", [
        {
            type: "NUMBER",
            name: "Songs amount",
            description: "Songs amount to skip in the queue",
            required: false,
        },
    ], 4, [], ["SEND_MESSAGES"], (commandData) => __awaiter(void 0, void 0, void 0, function* () {
        let songAmount = commandData.args[0];
        if (!songAmount || isNaN(songAmount))
            songAmount = 1;
        const isOk = yield commandData.client.player.skipSong(commandData.guild.id, songAmount);
        if (!isOk) {
            commandData.client.player.destroyStream(commandData.guild.id);
            return commandData.respond("There isn't any song left to play so leaving from your voice channel.");
        }
        else {
        }
        commandData.respond("Skipping " + songAmount + " song.");
        return true;
    }));
    commandManager.registerCommand("queue", ["q"], "Shows current song queue.", [], 4, [], ["SEND_MESSAGES"], (commandData) => __awaiter(void 0, void 0, void 0, function* () {
        const guild = commandData.client.player.listeners.get(commandData.guild.id);
        if (!guild)
            return commandData.respond("Guild not found!");
        console.log(guild.queue);
        return true;
    }));
    commandManager.registerCommand("pause", ["p"], "Pauses currently playing song.", [], 4, [], ["SEND_MESSAGES"], (commandData) => __awaiter(void 0, void 0, void 0, function* () {
        const isOk = yield commandData.client.player.pauseStream(commandData.guild.id);
        if (isOk) {
            commandData.respond("Ok!");
        }
        else {
            commandData.respond("Error");
        }
        return true;
    }));
    commandManager.registerCommand("resume", ["rs"], "Resumes paused song.", [], 4, [], ["SEND_MESSAGES"], (commandData) => __awaiter(void 0, void 0, void 0, function* () {
        const isOk = yield commandData.client.player.resumeStream(commandData.guild.id);
        if (isOk) {
            commandData.respond("Ok!");
        }
        else {
            commandData.respond("Error");
        }
        return true;
    }));
};
