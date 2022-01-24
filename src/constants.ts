import UserWarning from "./Classes/UserWarning";

interface Config {
  debugMode: boolean;
  bot: {
    token: string;
    activity: string;
    statPostInterval: number;
  };
  channels: {
    command: string;
    guild: string;
    error: string;
  };
  defaults: {
    language: LanguageOptions;
    prefix: string;
  };
  actions: {
    warnKickCount: number;
    warnBanCount: number;
  };
  apiKeys: {
    KSOFT: string;
  };
  botlists: Botlist[];
  dbUrl: string;
}

interface Botlist {
  name: string;
  url: string;
  header: any;
  body: any;
  token: string;
}

interface GuildOptions {
  premium?: boolean;
  prefix?: string;
  language?: LanguageOptions;
}

interface GuildModules {
  moderationModule?: {
    adminRole?: string | null;
    modRole?: string | null;
    warnings?: UserWarning[];
  };
  funModule?: {};
  utilsModule?: {};
}

interface UserOpitons {
  language?: LanguageOptions;
  premium?: boolean;
}

enum LanguageOptions {
  EN_US = "en_US",
  TR_TR = "tr_TR",
}

export {
  Config,
  Botlist,
  GuildOptions,
  UserOpitons,
  GuildModules,
  LanguageOptions,
};
