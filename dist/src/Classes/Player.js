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
const spotify_url_info_1 = __importDefault(require("spotify-url-info"));
const ytsr_1 = __importDefault(require("ytsr"));
const voice_1 = require("@discordjs/voice");
const play_dl_1 = require("play-dl");
const Song_1 = __importDefault(require("./Song"));
const Listener_1 = __importDefault(require("./Listener"));
class Player {
    constructor(client) {
        this.client = client;
        this.listeners = new Map();
        this.baseURLs = {
            spTrack: "open.spotify.com/track/",
            spPlaylist: "open.spotify.com/playlist/",
            spAlbum: "open.spotify.com/album/",
        };
    }
    searchSong(query) {
        return __awaiter(this, void 0, void 0, function* () {
            if (query.trim().indexOf(this.baseURLs.spTrack) > 0) {
                const spotifyData = yield spotify_url_info_1.default.getData(query.trim());
                if (!spotifyData)
                    return null;
                query = spotifyData.name;
            }
            else if (query.trim().indexOf(this.baseURLs.spotifyPlaylist) > 0) {
                return null;
            }
            const result = (yield (0, ytsr_1.default)(query.trim(), { limit: 2 })).items.filter((x) => x.type === "video")[0];
            if (!result)
                return null;
            else {
                return new Song_1.default(result.title, result.description, this.client.utils.parseDuration(result.duration), result.url);
            }
        });
    }
    createPlayerResource(song) {
        return __awaiter(this, void 0, void 0, function* () {
            const source = yield (0, play_dl_1.stream)(song.url, { quality: 2 });
            if (!(source === null || source === void 0 ? void 0 : source.stream))
                return null;
            return (0, voice_1.createAudioResource)(source.stream, {
                inputType: voice_1.StreamType.Arbitrary,
            });
        });
    }
    streamSong(guildId, song) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const listener = this.listeners.get(guildId);
                if (!listener)
                    return;
                const connection = (0, voice_1.getVoiceConnection)(guildId);
                if (!connection)
                    return;
                const player = (0, voice_1.createAudioPlayer)();
                const resource = yield this.createPlayerResource(song);
                if (!resource)
                    return;
                player.play(resource);
                connection.subscribe(player);
                listener.player = player;
                connection.on(voice_1.VoiceConnectionStatus.Disconnected, () => {
                    reject();
                });
                player.on("stateChange", (oldS, newS) => {
                    if (newS.status === voice_1.AudioPlayerStatus.Idle) {
                        resolve();
                    }
                });
                player.on("error", (err) => {
                    reject(err);
                });
            }));
        });
    }
    serveGuild(guildId, voiceChannel, textChannel, voiceAdapterCreator, song) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let voiceConnection = (0, voice_1.getVoiceConnection)(guildId) ||
                    (yield (0, voice_1.joinVoiceChannel)({
                        guildId: guildId,
                        channelId: voiceChannel,
                        adapterCreator: voiceAdapterCreator,
                    }));
                if (!voiceConnection)
                    return;
                let listenter = this.listeners.get(guildId);
                if (!listenter) {
                    this.listeners.set(guildId, new Listener_1.default(guildId, voiceChannel, textChannel, voiceAdapterCreator));
                    listenter = new Listener_1.default(guildId, voiceChannel, textChannel, voiceAdapterCreator);
                }
                if (song) {
                    listenter.queue.push(song);
                }
                else {
                    if (listenter.queue.length <= 0)
                        return;
                    song = listenter.queue[0];
                }
                while (listenter.queue.length > 0) {
                    try {
                        listenter.listening = true;
                        this.listeners.set(guildId, listenter);
                        yield this.streamSong(guildId, listenter.queue[0]);
                        listenter.queue.shift();
                        if (listenter.queue.length === 0) {
                            resolve();
                            listenter.listening = false;
                        }
                        this.listeners.set(guildId, listenter);
                    }
                    catch (err) {
                        this.destroyStream(guildId);
                        if (err) {
                            reject();
                            this.client.errorHandler.recordError(err);
                        }
                        else {
                            resolve();
                        }
                        break;
                    }
                }
            }));
        });
    }
    destroyStream(guildId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield (0, voice_1.getVoiceConnection)(guildId);
            connection === null || connection === void 0 ? void 0 : connection.destroy();
            this.listeners.delete(guildId);
        });
    }
    skipSong(guildId, songsToSkip) {
        return __awaiter(this, void 0, void 0, function* () {
            const listener = this.listeners.get(guildId);
            if (!listener)
                return false;
            for (var i = 0; i < songsToSkip; i++) {
                listener.queue.shift();
            }
            if (listener.queue.length <= 0)
                return false;
            const connection = yield (0, voice_1.getVoiceConnection)(guildId);
            if (!connection)
                return false;
            this.serveGuild(listener.guildId, listener.voiceChannel, listener.textChannel, listener.voiceAdapterCreator);
            return true;
        });
    }
    pauseStream(guildId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const listener = this.listeners.get(guildId);
            if (!listener)
                return false;
            (_a = listener.player) === null || _a === void 0 ? void 0 : _a.pause();
            return true;
        });
    }
    resumeStream(guildId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const listener = this.listeners.get(guildId);
            if (!listener)
                return false;
            (_a = listener.player) === null || _a === void 0 ? void 0 : _a.unpause();
            return true;
        });
    }
}
exports.default = Player;
