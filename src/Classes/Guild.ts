enum languages {
  EN_US = "en-US",
  TR_TR = "tr-TR",
}

interface GuildOptionsInterface {
  premium?: boolean;
  prefix?: string;
  language?: languages;
}

class Guild {
  _id: string;
  settings: GuildOptionsInterface;
  modules: object;

  constructor(id: string, settings?: GuildOptionsInterface) {
    this._id = id;
    this.settings = {};
    if (settings?.premium) {
      this.settings.premium = settings.premium;
    } else {
      this.settings.premium = false;
    }

    if (settings?.prefix) {
      this.settings.prefix = settings.prefix;
    } else {
      this.settings.prefix = "at!";
    }

    if (settings?.language) {
      this.settings.language = settings.language;
    } else {
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

export default Guild;
export { GuildOptionsInterface, Guild };
