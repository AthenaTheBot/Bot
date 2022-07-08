import { GuildModules } from "../constants";
import { AthenaConfig } from "../index";

class Guild {
  _id: string;
  modules: GuildModules;

  constructor(id: string, modules?: GuildModules) {
    this._id = id;

    this.modules = {
      settings: {
        prefix: modules?.settings?.prefix || AthenaConfig.defaults.prefix,
        language: modules?.settings?.language || AthenaConfig.defaults.language,
      },
      moderation: {
        adminRole: modules?.moderation?.adminRole || null,
        modRole: modules?.moderation?.adminRole || null,
        autoRole: modules?.moderation?.autoRole || null,
        warnings: modules?.moderation?.warnings || [],
      },
      welcomer: {
        messageToChannel: modules?.welcomer?.messageToChannel || null,
      },

      fun: {},
      utils: {},
    };
  }
}

export default Guild;
export { Guild };
