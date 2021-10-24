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
const discord_js_1 = require("discord.js");
exports.default = (commandManager) => {
    commandManager.registerCommand("prefix", [], "Change the prefix of Athena for your server and use the best fit for your server!", [
        {
            type: "STRING",
            name: "Prefix",
            description: "The prefix that you want to set",
            required: false,
        },
    ], 5, ["ADMINISTRATOR"], ["EMBED_LINKS"], (client, data, args) => __awaiter(void 0, void 0, void 0, function* () {
        const Embed = new discord_js_1.MessageEmbed().setColor("AQUA");
        if (args.length === 0) {
            try {
                data.reply({
                    embeds: [
                        Embed.setDescription("My current command prefix is: `" +
                            data.guild.data.settings.prefix +
                            "`"),
                    ],
                });
            }
            catch (err) {
                return false;
            }
            return true;
        }
        else {
            const success = yield client.dbManager.updateDocument("guilds", data.guild.id, { $set: { "settings.prefix": args[0] } });
            if (success) {
                data.reply({
                    embeds: [
                        Embed.setDescription("Successfully set server prefix as `" + args[0] + "`"),
                    ],
                });
            }
            else {
                data.reply({
                    embeds: [
                        Embed.setColor("RED").setDescription("An error occured while trying to set server prefix"),
                    ],
                });
            }
            return true;
        }
    }));
};
