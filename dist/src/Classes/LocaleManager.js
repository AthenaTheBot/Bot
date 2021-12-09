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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class LocaleManager {
    constructor(localesPath) {
        if (localesPath) {
            this.localesPath = localesPath;
        }
        else {
            this.localesPath = path_1.default.join(__dirname, "..", "..", "..", "Locales");
        }
        this.locales = {};
    }
    loadLocales() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const avaialbeLocales = fs_1.default.readdirSync(this.localesPath);
                for (var i = 0; i < avaialbeLocales.length; i++) {
                    const localeFiles = fs_1.default
                        .readdirSync(path_1.default.join(this.localesPath, avaialbeLocales[i]))
                        .filter((x) => x.endsWith(".json"));
                    const localeData = {};
                    for (var x = 0; x < localeFiles.length; x++) {
                        try {
                            const localeFileData = JSON.parse(fs_1.default.readFileSync(path_1.default.join(this.localesPath, avaialbeLocales[i], localeFiles[x]), "utf-8"));
                            Object.assign(localeData, {
                                [localeFiles[x].slice(0, localeFiles[x].length - ".json".length)]: localeFileData,
                            });
                        }
                        catch (err) { }
                    }
                    Object.assign(this.locales, { [avaialbeLocales[i]]: localeData });
                }
            }
            catch (err) { }
        });
    }
    getCategoryLocale(language, category) {
        const targetLocale = this.locales[language];
        if (!targetLocale)
            return {};
        if (category) {
            return targetLocale[category] || {};
        }
        const targetLocaleCategories = Object.getOwnPropertyNames(targetLocale);
        const locale = {};
        for (var i = 0; i < targetLocaleCategories.length; i++) {
            const targetProps = Object.getOwnPropertyNames(targetLocale[targetLocaleCategories[i]]);
            for (var x = 0; x < targetProps.length; x++) {
                Object.assign(locale, {
                    [targetProps[x]]: targetLocale[targetLocaleCategories[i]][targetProps[x]],
                });
            }
        }
        return locale;
    }
    updateCommandLocale(command, content) {
        return;
    }
}
exports.default = LocaleManager;
