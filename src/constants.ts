import UserWarning from "./Structures/UserWarning";

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
    autoRole: string | null;
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

enum Permissions {
  "CREATE_INSTANT_INVITE",
  "KICK_MEMBERS",
  "BAN_MEMBERS",
  "ADMINISTRATOR",
  "MANAGE_CHANNELS",
  "MANAGE_GUILD",
  "ADD_REACTIONS",
  "VIEW_AUDIT_LOG",
  "PRIORITY_SPEAKER",
  "STREAM",
  "VIEW_CHANNEL",
  "SEND_MESSAGES",
  "SEND_TTS_MESSAGES",
  "MANAGE_MESSAGES",
  "EMBED_LINKS",
  "ATTACH_FILES",
  "READ_MESSAGE_HISTORY",
  "MENTION_EVERYONE",
  "USE_EXTERNAL_EMOJIS",
  "VIEW_GUILD_INSIGHTS",
  "CONNECT",
  "SPEAK",
  "MUTE_MEMBERS",
  "DEAFEN_MEMBERS",
  "MOVE_MEMBERS",
  "USE_VAD",
  "CHANGE_NICKNAME",
  "MANAGE_NICKNAMES",
  "MANAGE_ROLES",
  "MANAGE_WEBHOOKS",
  "MANAGE_EMOJIS_AND_STICKERS",
  "USE_APPLICATION_COMMANDS",
  "REQUEST_TO_SPEAK",
  "MANAGE_EVENTS",
  "MANAGE_THREADS",
  "CREATE_PUBLIC_THREADS",
  "CREATE_PRIVATE_THREADS",
  "USE_EXTERNAL_STICKERS",
  "SEND_MESSAGES_IN_THREADS",
  "START_EMBEDDED_ACTIVITIES",
}

enum TextPerms {
  "CREATE_INSTANT_INVITE",
  "MANAGE_CHANNELS",
  "ADD_REACTIONS",
  "VIEW_CHANNEL",
  "SEND_MESSAGES",
  "SEND_TTS_MESSAGES",
  "MANAGE_MESSAGES",
  "EMBED_LINKS",
  "ATTACH_FILES",
  "READ_MESSAGE_HISTORY",
  "MENTION_EVERYONE",
  "USE_EXTERNAL_EMOJIS",
  "MANAGE_ROLES",
  "MANAGE_WEBHOOKS",
  "USE_APPLICATION_COMMANDS",
  "MANAGE_THREADS",
  "CREATE_PUBLIC_THREADS",
  "CREATE_PRIVATE_THREADS",
  "USE_EXTERNAL_STICKERS",
  "SEND_MESSAGES_IN_THREADS",
}

enum VoicePerms {
  "CREATE_INSTANT_INVITE",
  "MANAGE_CHANNELS",
  "PRIORITY_SPEAKER",
  "STREAM",
  "VIEW_CHANNEL",
  "CONNECT",
  "SPEAK",
  "MUTE_MEMBERS",
  "DEAFEN_MEMBERS",
  "MOVE_MEMBERS",
  "USE_VAD",
  "MANAGE_ROLES",
  "MANAGE_EVENTS",
  "START_EMBEDDED_ACTIVITIES",
}

enum RolePerms {
  "KICK_MEMBERS",
  "BAN_MEMBERS",
  "ADMINISTRATOR",
  "MANAGE_GUILD",
  "VIEW_AUDIT_LOG",
  "VIEW_GUILD_INSIGHTS",
  "CHANGE_NICKNAME",
  "MANAGE_EMOJIS_AND_STICKERS",
}

export {
  Config,
  Botlist,
  GuildOptions,
  UserOpitons,
  GuildModules,
  LanguageOptions,
  TextPerms,
  RolePerms,
  VoicePerms,
  Permissions,
};
