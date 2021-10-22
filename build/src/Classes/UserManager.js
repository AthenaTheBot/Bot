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
const mongoose_1 = require("mongoose");
const Logger_1 = __importDefault(require("./Logger"));
const User_1 = __importDefault(require("./User"));
const UserSchema_1 = __importDefault(require("../Schemas/UserSchema"));
class UserManager {
    constructor(dbManager) {
        this.logger = new Logger_1.default();
        this.dbManager = dbManager;
        this.userCache = [];
    }
    create(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const userModel = (0, mongoose_1.model)("User", UserSchema_1.default);
            const user = new userModel(new User_1.default(id, options));
            user.save((err) => {
                if (err)
                    this.logger.error(err);
            });
        });
    }
    edit() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            this.dbManager.removeDocument("users", id).then((state) => {
                if (!state) {
                    this.logger.error(`An error occured during deletion process on user '${id}'. Error Date: [${(0, dayjs_1.default)().format("L LT")}]`);
                }
            });
        });
    }
}
exports.default = UserManager;
