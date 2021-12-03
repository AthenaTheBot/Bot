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
const Utils_1 = __importDefault(require("./Utils"));
const Song_1 = __importDefault(require("./Song"));
const Listener_1 = __importDefault(require("./Listener"));
const Logger_1 = __importDefault(require("./Logger"));
class Player {
    constructor() {
        this.listeners = new Map();
        this.logger = new Logger_1.default();
        this.utils = new Utils_1.default();
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
                return new Song_1.default(result.title, result.description, this.utils.parseDuration(result.duration), result.url);
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
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                const connection = (0, voice_1.getVoiceConnection)(guildId);
                if (!connection)
                    return;
                const player = (0, voice_1.createAudioPlayer)();
                const resource = yield this.createPlayerResource(song);
                if (!resource)
                    return;
                player.play(resource);
                connection.subscribe(player);
                player.on("stateChange", (oldS, newS) => {
                    if (newS.status === "idle") {
                        resolve();
                    }
                });
            }));
        });
    }
    serveGuild(guild, voiceChannel, textChannel, song) {
        return __awaiter(this, void 0, void 0, function* () {
            let voiceConnection = (0, voice_1.getVoiceConnection)(guild.id) ||
                (yield (0, voice_1.joinVoiceChannel)({
                    guildId: guild.id,
                    channelId: voiceChannel,
                    adapterCreator: guild.voiceAdapterCreator,
                }));
            if (!voiceConnection)
                return;
            let listenter = this.listeners.get(guild.id);
            if (!listenter) {
                this.listeners.set(guild.id, new Listener_1.default(guild.id, voiceChannel, textChannel));
                listenter = new Listener_1.default(guild.id, voiceChannel, textChannel);
            }
            listenter.queue.push(song);
            while (listenter.queue.length > 0) {
                listenter.listening = true;
                this.listeners.set(guild.id, listenter);
                yield this.streamSong(guild.id, listenter.queue[0]);
                listenter.queue.shift();
                if (listenter.queue.length === 0)
                    listenter.listening = false;
                this.listeners.set(guild.id, listenter);
            }
        });
    }
}
exports.default = Player;
