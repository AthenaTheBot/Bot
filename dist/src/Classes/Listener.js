"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GuildQueue {
    constructor(id, voiceChannel, textChannel, voiceAdapterCreator, queue) {
        this.guildId = id;
        this.voiceChannel = voiceChannel;
        this.textChannel = textChannel;
        this.voiceAdapterCreator = voiceAdapterCreator;
        this.player = null;
        if (queue) {
            this.queue = [...queue];
        }
        else {
            this.queue = [];
        }
        this.listening = false;
    }
}
exports.default = GuildQueue;
