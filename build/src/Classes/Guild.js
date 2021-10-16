"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildSchema = exports.Guild = void 0;
const mongoose_1 = require("mongoose");
class Guild {
    constructor(id) {
        this._id = id;
        this.settings = {
            premium: false,
            prefix: "at!",
            language: "en-US",
        };
        this.modules = {
            moderationModule: {},
            funModule: {},
            utilsModule: {},
        };
    }
}
exports.Guild = Guild;
const GuildSchema = new mongoose_1.Schema({
    _id: String,
    settings: {
        premium: Boolean,
        prefix: String,
        language: String,
    },
    modules: {
        moderationModule: {},
        funModule: {},
        utilsModule: {},
    },
    lastUpdated: String,
});
exports.GuildSchema = GuildSchema;
