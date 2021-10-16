"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    _id: String,
    settings: {
        language: String,
        premimum: Boolean,
    },
    lastUpdated: String,
});
exports.default = UserSchema;
