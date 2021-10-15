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
const Logger_1 = __importDefault(require("./Classes/Logger"));
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
        this.logger = new Logger_1.default();
        this.dbManager = new DatabaseManager_1.default(this.config.db_url);
    }
    initalize() {
        return __awaiter(this, void 0, void 0, function* () {
            this.dbManager.connect().then((success) => {
                if (success)
                    this.logger.success("Successfully connected to database server.");
                else
                    this.logger.error("An error occured while tring to connect database server");
            });
            try {
                yield this.login(this.config.bot.token);
            }
            catch (err) {
                this.logger.error("Failed while trying to login into discord account.");
                return;
            }
            this.logger.success("Successfully logged in to discord account.");
        });
    }
}
exports.default = AthenaClient;
