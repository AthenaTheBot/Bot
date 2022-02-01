import { GuildOptions, GuildModules } from "../constants";
import { AthenaConfig } from "../index";

class Guild {
  _id: string;
  settings: GuildOptions;
  modules: GuildModules;

  constructor(id: string, settings?: GuildOptions, modules?: GuildModules) {
    this._id = id;

    this.settings = {
      premium: settings?.premium || false,
      prefix: settings?.prefix || AthenaConfig.defaults.prefix,
      language: settings?.language || AthenaConfig.defaults.language,
    };

    this.modules = {
      moderationModule: {
        adminRole: modules?.moderationModule?.adminRole || null,
        modRole: modules?.moderationModule?.adminRole || null,
        warnings: modules?.moderationModule?.warnings || [],
      },

      funModule: {},
      utilsModule: {},
    };
  }
}

export default Guild;
export { Guild };
