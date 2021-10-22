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
const mongoose_1 = require("mongoose");
const dayjs_1 = __importDefault(require("dayjs"));
const Logger_1 = __importDefault(require("./Logger"));
const Guild_1 = __importDefault(require("./Guild"));
const GuildSchema_1 = __importDefault(require("../Schemas/GuildSchema"));
class GuildManager {
    constructor(dbManager) {
        this.logger = new Logger_1.default();
        this.dbManager = dbManager;
        this.guildCache = [];
    }
    create(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const guildModel = (0, mongoose_1.model)("Guild", GuildSchema_1.default);
            const guild = new guildModel(new Guild_1.default(id, options));
            guild.save((err) => {
                if (err)
                    this.logger.error(err);
            });
        });
    }
    edit(id) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            this.dbManager.removeDocument("guilds", id).then((state) => {
                if (!state) {
                    this.logger.error(`An error occured during deletion process on guild '${id}'. Error Date: [${(0, dayjs_1.default)().format("L LT")}]`);
                }
            });
        });
    }
}
exports.default = GuildManager;
