"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var languages;
(function (languages) {
    languages["EN_US"] = "en-US";
    languages["TR_TR"] = "tr-TR";
})(languages || (languages = {}));
class User {
    constructor(id, settings) {
        this.id = id;
        this.settings = {};
        if (settings === null || settings === void 0 ? void 0 : settings.language) {
            this.settings.language = settings.language;
        }
        else {
            this.settings.language = languages.EN_US;
        }
        if (settings === null || settings === void 0 ? void 0 : settings.premium) {
            this.settings.premium = settings.premium;
        }
        else {
            this.settings.premium = false;
        }
    }
}
exports.User = User;
exports.default = User;
