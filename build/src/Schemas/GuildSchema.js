"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
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
exports.default = GuildSchema;
