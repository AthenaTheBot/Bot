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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandDataTypes = exports.CommandData = void 0;
const discord_js_1 = require("discord.js");
var CommandDataTypes;
(function (CommandDataTypes) {
    CommandDataTypes["Interaction"] = "Interaction";
    CommandDataTypes["Message"] = "Message";
})(CommandDataTypes || (CommandDataTypes = {}));
exports.CommandDataTypes = CommandDataTypes;
class CommandData {
    constructor(client, source) {
        var _a, _b, _c;
        this.client = client;
        if (source.type) {
            this.raw = source.data;
            this.type = source.type;
            this.author = (_a = source.data) === null || _a === void 0 ? void 0 : _a.member;
            this.guild = (_b = source.data) === null || _b === void 0 ? void 0 : _b.guild;
            this.channel = (_c = source.data) === null || _c === void 0 ? void 0 : _c.channel;
            this.db = source.db;
            if (this.type === CommandDataTypes.Message) {
                this.args = this.raw.content.trim().split(/ +/).slice(1);
            }
            else {
                const args = [];
                for (var i = 0; i < this.raw.options.data.length; i++) {
                    args.push(this.raw.options.data[i].value);
                }
                this.args = args;
            }
        }
        else {
            throw new Error("Cannot create command data instance without a data type.");
        }
    }
    respond(message) {
        return __awaiter(this, void 0, void 0, function* () {
            let respondData;
            let payload = message instanceof discord_js_1.MessageEmbed
                ? { embeds: [(message === null || message === void 0 ? void 0 : message.color) ? message : message.setColor("#5865F2")] }
                : message;
            try {
                if (this.type === CommandDataTypes.Interaction) {
                    respondData = yield this.raw.reply(payload);
                }
                else {
                    respondData = yield this.raw.channel.send(payload);
                }
            }
            catch (err) {
                console.error(err);
                respondData = null;
            }
            return respondData;
        });
    }
}
exports.CommandData = CommandData;
exports.default = CommandData;
