"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Guild = void 0;
var languages;
(function (languages) {
    languages["EN_US"] = "en-US";
    languages["TR_TR"] = "tr-TR";
})(languages || (languages = {}));
class Guild {
    constructor(id, settings) {
        this._id = id;
        this.settings = {};
        if (settings === null || settings === void 0 ? void 0 : settings.premium) {
            this.settings.premium = settings.premium;
        }
        else {
            this.settings.premium = false;
        }
        if (settings === null || settings === void 0 ? void 0 : settings.prefix) {
            this.settings.prefix = settings.prefix;
        }
        else {
            this.settings.prefix = "at!";
        }
        if (settings === null || settings === void 0 ? void 0 : settings.language) {
            this.settings.language = settings.language;
        }
        else {
            this.settings.language = languages.EN_US;
        }
        this.modules = {
            moderationModule: {
                adminRole: null,
                modRole: null,
            },
            funModule: {},
            utilsModule: {},
        };
    }
}
exports.Guild = Guild;
exports.default = Guild;
