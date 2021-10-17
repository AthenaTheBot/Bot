"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Event_1 = __importDefault(require("../Classes/Event"));
exports.default = new Event_1.default("messageCreate", (client, data) => {
    console.log(data.content);
    return true;
});
