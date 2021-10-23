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
const Logger_1 = __importDefault(require("./Logger"));
const User_1 = __importDefault(require("./User"));
class UserManager {
    constructor(dbManager) {
        this.logger = new Logger_1.default();
        this.dbManager = dbManager;
        this.userCache = [];
    }
    create(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = new User_1.default(id, options);
            const success = yield this.dbManager.createDocument("users", user);
            if (success) {
                this.userCache.push(user);
                return user;
            }
            else {
                return null;
            }
        });
    }
    edit() {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.dbManager.removeDocument("users", id);
        });
    }
    fetch(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
}
exports.default = UserManager;
