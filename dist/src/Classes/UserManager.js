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
    }
    create(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = new User_1.default(id, options);
            const success = yield this.dbManager.createDocument("users", user);
            if (success)
                return user;
            else {
                this.logger.error("An error occured while trying to create a user with id " + id + ".");
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
    fetch(id, createUserIfNotExists) {
        return __awaiter(this, void 0, void 0, function* () {
            const userDocument = yield this.dbManager.getDocument("users", id);
            const user = new User_1.default(userDocument === null || userDocument === void 0 ? void 0 : userDocument._id, userDocument === null || userDocument === void 0 ? void 0 : userDocument.settings);
            if (!user._id) {
                if (createUserIfNotExists) {
                    return yield this.create(id);
                }
                else {
                    return null;
                }
            }
            return user;
        });
    }
    updateUser(id, mongoQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = (yield this.dbManager.getDocument("users", id));
            if (!user) {
                user = (yield this.create(id));
                if (!user)
                    return false;
            }
            const success = yield this.dbManager.updateDocument("users", user._id, mongoQuery);
            if (success)
                return true;
            else
                return false;
        });
    }
}
exports.default = UserManager;