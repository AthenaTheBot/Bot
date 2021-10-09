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
const discord_js_1 = require("discord.js");
const dayjs_1 = __importDefault(require("dayjs"));
const DatabaseManager_1 = __importDefault(require("./Classes/DatabaseManager"));
class AthenaClient extends discord_js_1.Client {
    constructor(config) {
        super({
            intents: [
                discord_js_1.Intents.FLAGS.GUILDS,
                discord_js_1.Intents.FLAGS.GUILD_MEMBERS,
                discord_js_1.Intents.FLAGS.GUILD_MESSAGES,
            ],
        });
        this.config = config;
        this.dbManager = new DatabaseManager_1.default(this.config.db_url);
    }
    log(msg, type) {
        let tag;
        switch (type) {
            case "success":
                tag = "\x1b[42m\x1b[30m SUCCESS \x1b[0m";
                break;
            case "error":
                tag = "\x1b[41m\x1b[30m ERROR \x1b[0m";
                break;
            case "warn":
                tag = "\x1b[43m\x1b[30m WARN \x1b[0m";
                break;
            default:
                tag = "\x1b[47m\x1b[30m LOG \x1b[0m";
                break;
        }
        const date = (0, dayjs_1.default)(Date.now()).format("DD/MM/YYYY hh:mm");
        console.log(`[${date}] ${tag} ${msg}`);
    }
    initalize() {
        return __awaiter(this, void 0, void 0, function* () {
            this.dbManager.connect().then((success) => {
                if (success)
                    this.log("Successfully connected to database server.", "success");
                else
                    this.log("An error occured while tring to connect database server", "error");
            });
            try {
                yield this.login(this.config.bot.token);
            }
            catch (err) {
                this.log("Failed to loggining into discord account.");
                return;
            }
            this.log("Successfully logged in to discord account.", "success");
        });
    }
}
exports.default = AthenaClient;
