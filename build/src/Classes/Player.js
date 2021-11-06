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
const Utils_1 = __importDefault(require("./Utils"));
const Song_1 = __importDefault(require("./Song"));
class Player {
    constructor() {
        this.guildQueues = [];
        this.regExps = {
            youtubeVideo: new RegExp(/^https?:\/\/(?:(?:www|m)\.)?(?:youtube\.com\/watch(?:\?v=|\?.+?&v=)|youtu\.be\/)([a-z0-9_-]+)$/i),
            spotifyPlaylist: new RegExp(/^https?:\/\/(?:open|play)\.spotify\.com\/user\/([\w\d]+)\/playlist\/[\w\d]+$/i),
            spotifyTrack: new RegExp(/^https?:\/\/(?:open|play)\.spotify\.com\/track\/[\w\d]+$/i),
        };
        this.utils = new Utils_1.default();
    }
    searchSong(query) {
        return __awaiter(this, void 0, void 0, function* () {
            if (query.match(this.regExps.spotifyTrack)) {
                const spotifyData = yield spotify_url_info_1.default.getData(query.trim());
                if (!spotifyData)
                    return null;
                query = spotifyData;
            }
            else if (query.match(this.regExps.spotifyPlaylist)) {
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
}
exports.default = Player;
