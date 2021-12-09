import fs from "fs";
import path from "path";

class LocaleManager {
  localesPath: string;
  locales: object;

  constructor(localesPath?: string) {
    if (localesPath) {
      this.localesPath = localesPath;
    } else {
      this.localesPath = path.join(__dirname, "..", "..", "..", "Locales");
    }

    this.locales = {};
  }

  async loadLocales(): Promise<void> {
    try {
      const avaialbeLocales: string[] = fs.readdirSync(this.localesPath);

      // Loop through locale folders
      for (var i = 0; i < avaialbeLocales.length; i++) {
        // Loop through locale files
        const localeFiles: string[] = fs
          .readdirSync(path.join(this.localesPath, avaialbeLocales[i]))
          .filter((x) => x.endsWith(".json"));

        const localeData = {};

        // Read every locale file
        for (var x = 0; x < localeFiles.length; x++) {
          try {
            const localeFileData = JSON.parse(
              fs.readFileSync(
                path.join(this.localesPath, avaialbeLocales[i], localeFiles[x]),
                "utf-8"
              )
            );

            Object.assign(localeData, {
              [localeFiles[x].slice(0, localeFiles[x].length - ".json".length)]:
                localeFileData,
            });
          } catch (err) {}
        }

        Object.assign(this.locales, { [avaialbeLocales[i]]: localeData });
      }
    } catch (err) {}
  }

  getCategoryLocale(language: string, category?: string): object {
    const targetLocale = (this.locales as any)[language];

    if (!targetLocale) return {};

    if (category) {
      return targetLocale[category] || {};
    }

    const targetLocaleCategories = Object.getOwnPropertyNames(targetLocale);
    const locale = {};

    // Loop through all categories
    for (var i = 0; i < targetLocaleCategories.length; i++) {
      const targetProps = Object.getOwnPropertyNames(
        targetLocale[targetLocaleCategories[i]]
      );

      // Loop through all properties of target category
      for (var x = 0; x < targetProps.length; x++) {
        Object.assign(locale, {
          [targetProps[x]]:
            targetLocale[targetLocaleCategories[i]][(targetProps as any)[x]],
        });
      }
    }

    return locale;
  }

  // TODO
  updateCommandLocale(command: string, content: object): void {
    return;
  }
}

export default LocaleManager;
