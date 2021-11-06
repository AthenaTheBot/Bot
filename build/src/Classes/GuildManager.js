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
const dayjs_1 = __importDefault(require("dayjs"));
const localizedFormat_1 = __importDefault(require("dayjs/plugin/localizedFormat"));
dayjs_1.default.extend(localizedFormat_1.default);
const Logger_1 = __importDefault(require("./Logger"));
const Guild_1 = __importDefault(require("./Guild"));
class GuildManager {
    constructor(dbManager) {
        this.logger = new Logger_1.default();
        this.dbManager = dbManager;
    }
    create(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const guild = new Guild_1.default(id, options);
            const success = yield this.dbManager.createDocument("guilds", guild);
            if (success)
                return guild;
            else {
                this.logger.error("An error occured while trying to create a guild with id " + id + ".");
                return null;
            }
        });
    }
    edit(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.dbManager.removeDocument("guilds", id);
        });
    }
    fetch(id, createGuildIfNotExists) {
        return __awaiter(this, void 0, void 0, function* () {
            const guildDocument = yield this.dbManager.getDocument("guilds", id);
            const guild = new Guild_1.default(guildDocument === null || guildDocument === void 0 ? void 0 : guildDocument._id, guildDocument === null || guildDocument === void 0 ? void 0 : guildDocument.settings);
            if (!guild._id) {
                if (createGuildIfNotExists) {
                    return yield this.create(id);
                }
                else {
                    return null;
                }
            }
            return guild;
        });
    }
    updateGuild(id, mongoQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            let guild = (yield this.dbManager.getDocument("guilds", id));
            if (!guild) {
                guild = (yield this.create(id));
                if (!guild)
                    return false;
            }
            const success = yield this.dbManager.updateDocument("guilds", guild._id, mongoQuery);
            if (success)
                return true;
            else
                return false;
        });
    }
}
exports.default = GuildManager;
